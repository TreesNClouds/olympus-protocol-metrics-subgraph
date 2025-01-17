import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";

import { FraxSwapPool } from "../../generated/ProtocolMetrics/FraxSwapPool";
import { TokenRecord, TokenRecords } from "../../generated/schema";
import {
  ERC20_OHM_V2,
  getContractName,
  getWalletAddressesForContract,
  liquidityPairHasToken,
} from "./Constants";
import { getERC20 } from "./ContractHelper";
import { toDecimal } from "./Decimals";
import { getUSDRate } from "./Price";
import {
  addToMetricName,
  newTokenRecord,
  newTokenRecords,
  pushTokenRecord,
} from "./TokenRecordHelper";

function getFraxSwapPair(pairAddress: string, blockNumber: BigInt): FraxSwapPool | null {
  const pair = FraxSwapPool.bind(Address.fromString(pairAddress));

  // If the token does not exist at the current block, it will revert
  if (pair.try_token0().reverted) {
    log.debug(
      "getFraxSwapPair: ERC20 token for FraxSwap pair {} could not be determined at block {} due to contract revert. Skipping",
      [getContractName(pairAddress), blockNumber.toString()],
    );
    return null;
  }

  return pair;
}

/**
 * Returns the total value of the given FraxSwap pair.
 *
 * Calculated as: token0 balance * token0 rate + token1 balance * token1 rate
 *
 * @param pairAddress
 * @param excludeOhmValue If true, the value will exclude OHM. This can be used to calculate backing
 * @param restrictToToken  If true, the value will be restricted to that of the specified token. This can be used to calculate the value of liquidity for a certain token.
 * @param tokenAddress The tokenAddress to restrict to (or null)
 * @param blockNumber
 * @returns
 */
export function getFraxSwapPairTotalValue(
  pairAddress: string,
  excludeOhmValue: boolean,
  restrictToToken: boolean,
  tokenAddress: string | null,
  blockNumber: BigInt,
): BigDecimal {
  const pair = getFraxSwapPair(pairAddress, blockNumber);
  if (!pair) {
    log.info(
      "getFraxSwapPairTotalValue: Unable to bind to FraxSwapPool {} ({}) at block {}. Skipping",
      [getContractName(pairAddress), pairAddress, blockNumber.toString()],
    );
    return BigDecimal.zero();
  }

  let totalValue = BigDecimal.zero();
  log.info(
    "getFraxSwapPairTotalValue: Calculating value of pair {} with excludeOhmValue = {}, restrictToToken = {}, token = {}",
    [
      getContractName(pairAddress),
      excludeOhmValue ? "true" : "false",
      restrictToToken ? "true" : "false",
      tokenAddress ? getContractName(tokenAddress) : "null",
    ],
  );

  const tokens: Address[] = [];
  tokens.push(pair.token0());
  tokens.push(pair.token1());

  const reserves: BigInt[] = [];
  reserves.push(pair.getReserves().value0);
  reserves.push(pair.getReserves().value1);

  // token0 balance * token0 rate + token1 balance * token1 rate
  for (let i = 0; i < tokens.length; i++) {
    const token: string = tokens[i].toHexString();

    if (excludeOhmValue && token.toLowerCase() == ERC20_OHM_V2.toLowerCase()) {
      log.debug("getFraxSwapPairTotalValue: Skipping OHM as excludeOhmValue is true", []);
      continue;
    }

    if (tokenAddress && restrictToToken && tokenAddress.toLowerCase() != token.toLowerCase()) {
      log.debug("getFraxSwapPairTotalValue: Skipping token {} ({}) as restrictToToken is true", [
        getContractName(token),
        token,
      ]);
      continue;
    }

    const tokenContract = getERC20(token, blockNumber);
    if (!tokenContract) {
      throw new Error("Unable to fetch ERC20 at address " + token + " for FraxSwap pool");
    }

    const tokenBalance = reserves[i];
    const tokenBalanceDecimal = toDecimal(tokenBalance, tokenContract.decimals());
    const rate = getUSDRate(token, blockNumber);
    const value = tokenBalanceDecimal.times(rate);
    log.debug(
      "getFraxSwapPairTotalValue: Token address: {} ({}), balance: {}, rate: {}, value: {}",
      [
        getContractName(token),
        token,
        tokenBalanceDecimal.toString(),
        rate.toString(),
        value.toString(),
      ],
    );

    totalValue = totalValue.plus(value);
  }

  return totalValue;
}

/**
 * Determines the unit rate of the given FraxSwap pool.
 *
 * Unit rate = total value / total supply
 *
 * @param poolTokenContract
 * @param totalValue
 * @param _blockNumber
 * @returns
 */
export function getFraxSwapPairUnitRate(
  pairContract: FraxSwapPool,
  totalValue: BigDecimal,
  blockNumber: BigInt,
): BigDecimal {
  const pairAddress = pairContract._address.toHexString().toLowerCase();
  log.info(
    "getFraxSwapPairUnitRate: Calculating unit rate for FraxSwap pair {} at block number {}",
    [getContractName(pairAddress), blockNumber.toString()],
  );

  const totalSupply = toDecimal(pairContract.totalSupply(), pairContract.decimals());
  log.debug("getFraxSwapPairUnitRate: FraxSwap pair {} has total supply of {}", [
    getContractName(pairAddress),
    totalSupply.toString(),
  ]);
  const unitRate = totalValue.div(totalSupply);
  log.info("getFraxSwapPairUnitRate: Unit rate of FraxSwap LP {} is {} for total supply {}", [
    pairAddress,
    unitRate.toString(),
    totalSupply.toString(),
  ]);
  return unitRate;
}

/**
 * Helper method to simplify getting the balance from a FraxSwapPool contract.
 *
 * Returns 0 if the minimum block number has not passed.
 *
 * @param contract The bound FraxSwapPool contract.
 * @param address The address of the holder.
 * @param blockNumber The current block number.
 * @returns BigDecimal
 */
function getFraxSwapPairTokenBalance(
  contract: FraxSwapPool | null,
  address: string,
  _blockNumber: BigInt,
): BigDecimal {
  if (!contract) {
    return BigDecimal.zero();
  }

  return toDecimal(contract.balanceOf(Address.fromString(address)), contract.decimals());
}

function getFraxSwapPairTokenRecord(
  metricName: string,
  pairContract: FraxSwapPool,
  unitRate: BigDecimal,
  walletAddress: string,
  multiplier: BigDecimal,
  blockNumber: BigInt,
): TokenRecord | null {
  const pairAddress = pairContract._address.toHexString().toLowerCase();
  const tokenBalance = getFraxSwapPairTokenBalance(pairContract, walletAddress, blockNumber);
  if (tokenBalance.equals(BigDecimal.zero())) {
    log.debug(
      "getFraxSwapPairTokenRecord: FraxSwap pair balance for token {} ({}) in wallet {} ({}) was 0 at block {}",
      [
        getContractName(pairAddress),
        pairAddress,
        getContractName(walletAddress),
        walletAddress,
        blockNumber.toString(),
      ],
    );
    return null;
  }

  return newTokenRecord(
    metricName,
    getContractName(pairAddress),
    pairAddress,
    getContractName(walletAddress),
    walletAddress,
    unitRate,
    tokenBalance,
    blockNumber,
    multiplier,
  );
}

/**
 * Provides TokenRecords representing the FraxSwap pair identified by {pairAddress}.
 *
 * @param metricName
 * @param pairAddress The address of the pool
 * @param excludeOhmValue If true, the value will exclude that of OHM
 * @param restrictToTokenValue If true, the value will reflect the portion of the pool made up by {tokenAddress}. Overrides {excludeOhmValue}.
 * @param blockNumber The current block number
 * @param tokenAddress If specified, this function will exit if the token is not in the liquidity pool
 * @returns
 */
export function getFraxSwapPairRecords(
  metricName: string,
  pairAddress: string,
  excludeOhmValue: boolean,
  restrictToTokenValue: boolean,
  blockNumber: BigInt,
  tokenAddress: string | null = null,
): TokenRecords {
  const records = newTokenRecords(addToMetricName(metricName, "FraxSwapPool"), blockNumber);
  // If we are restricting by token and tokenAddress does not match either side of the pair
  if (tokenAddress && !liquidityPairHasToken(pairAddress, tokenAddress)) {
    log.debug(
      "getFraxSwapPairRecords: Skipping FraxSwap pair that does not match specified token address {} ({})",
      [getContractName(tokenAddress), tokenAddress],
    );
    return records;
  }

  const pairContract = getFraxSwapPair(pairAddress, blockNumber);
  if (!pairContract || pairContract.totalSupply().equals(BigInt.zero())) {
    log.debug(
      "getFraxSwapPairRecords: Skipping FraxSwap pair {} with total supply of 0 at block {}",
      [getContractName(pairAddress), blockNumber.toString()],
    );
    return records;
  }

  // Calculate total value of the LP
  const totalValue = getFraxSwapPairTotalValue(pairAddress, false, false, null, blockNumber);
  const includedValue = getFraxSwapPairTotalValue(
    pairAddress,
    excludeOhmValue,
    restrictToTokenValue,
    tokenAddress,
    blockNumber,
  );
  // Calculate multiplier
  const multiplier =
    excludeOhmValue || (tokenAddress && restrictToTokenValue)
      ? includedValue.div(totalValue)
      : BigDecimal.fromString("1");
  log.info(
    "getFraxSwapPairRecords: applying multiplier of {} based on excludeOhmValue = {} and restrictToTokenValue = {}",
    [multiplier.toString(), excludeOhmValue ? "true" : "false", "false"],
  );

  // Calculate the unit rate of the LP
  const unitRate = getFraxSwapPairUnitRate(pairContract, totalValue, blockNumber);

  const wallets = getWalletAddressesForContract(pairAddress);
  for (let i = 0; i < wallets.length; i++) {
    const walletAddress = wallets[i];

    const record = getFraxSwapPairTokenRecord(
      records.id,
      pairContract,
      unitRate,
      walletAddress,
      multiplier,
      blockNumber,
    );

    if (record && !record.balance.equals(BigDecimal.zero())) {
      pushTokenRecord(records, record);
    }
  }

  return records;
}

// ### Token Quantity ###
function getBigDecimalFromBalance(
  tokenAddress: string,
  balance: BigInt,
  blockNumber: BigInt,
): BigDecimal {
  const tokenContract = getERC20(tokenAddress, blockNumber);
  if (!tokenContract) {
    throw new Error("Unable to fetch ERC20 at address " + tokenAddress + " for FraxSwap pool");
  }

  return toDecimal(balance, tokenContract.decimals());
}

/**
 * Calculates the quantity of {tokenAddress}
 * contained within the pair at {pairAddress}.
 *
 * If {tokenAddress} is not present within the pair,
 * 0 will be returned.
 *
 * @param pairAddress address of a FraxSwap pair
 * @param tokenAddress address of the token to look for
 * @param blockNumber current block number
 * @returns BigDecimal representing the quantity, or 0
 */
export function getFraxSwapPairTokenQuantity(
  pairAddress: string,
  tokenAddress: string,
  blockNumber: BigInt,
): BigDecimal {
  const pair = getFraxSwapPair(pairAddress, blockNumber);
  if (!pair) {
    return BigDecimal.zero();
  }

  const token0 = pair.token0();
  const token1 = pair.token1();

  if (token0.equals(Address.fromString(tokenAddress))) {
    const token0Balance = pair.getReserves().value0;
    return getBigDecimalFromBalance(tokenAddress, token0Balance, blockNumber);
  } else if (token1.equals(Address.fromString(tokenAddress))) {
    const token1Balance = pair.getReserves().value1;
    return getBigDecimalFromBalance(tokenAddress, token1Balance, blockNumber);
  }

  log.warning(
    "getFraxSwapPairTokenQuantity: Attempted to obtain quantity of token {} from FraxSwap pair {} at block {}, but it was not found",
    [getContractName(tokenAddress), getContractName(pairAddress), blockNumber.toString()],
  );
  return BigDecimal.zero();
}

export function getFraxSwapPairTokenQuantityRecords(
  metricName: string,
  pairAddress: string,
  tokenAddress: string,
  blockNumber: BigInt,
): TokenRecords {
  log.info(
    "getFraxSwapPairTokenQuantityRecords: Calculating quantity of token {} in FraxSwap pool {}",
    [getContractName(tokenAddress), getContractName(pairAddress)],
  );
  const records = newTokenRecords(
    addToMetricName(metricName, "FraxSwapPoolTokenQuantity"),
    blockNumber,
  );

  const pair = getFraxSwapPair(pairAddress, blockNumber);
  if (!pair) return records;

  // Calculate the token quantity for the pool
  const totalQuantity = getFraxSwapPairTokenQuantity(pairAddress, tokenAddress, blockNumber);

  const pairDecimals = pair.decimals();
  log.info(
    "getFraxSwapPairTokenQuantityRecords: FraxSwap pool {} has total quantity {} of token {}",
    [getContractName(pairAddress), totalQuantity.toString(), getContractName(tokenAddress)],
  );
  const pairTotalSupply = toDecimal(pair.totalSupply(), pairDecimals);

  // Grab balances
  const pairBalanceRecords = getFraxSwapPairRecords(
    records.id,
    pairAddress,
    false,
    false,
    blockNumber,
    tokenAddress,
  );

  for (let i = 0; i < pairBalanceRecords.records.length; i++) {
    const recordId = pairBalanceRecords.records[i];
    const record = TokenRecord.load(recordId);
    if (!record) {
      throw new Error("Unable to load TokenRecord with id " + recordId);
    }

    const tokenBalance = totalQuantity.times(record.balance).div(pairTotalSupply);
    pushTokenRecord(
      records,
      newTokenRecord(
        records.id,
        getContractName(tokenAddress) + " in " + getContractName(pairAddress),
        pairAddress,
        record.source,
        record.sourceAddress,
        BigDecimal.fromString("1"),
        tokenBalance,
        blockNumber,
      ),
    );
  }

  return records;
}
