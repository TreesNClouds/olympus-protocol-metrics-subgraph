import { BigInt, log } from "@graphprotocol/graph-ts";

import { TokenRecords } from "../../generated/schema";
import {
  ERC20_ADAI,
  ERC20_DAI,
  ERC20_FEI,
  ERC20_FRAX,
  ERC20_LUSD,
  ERC20_STABLE_TOKENS,
  ERC20_UST,
  getContractName,
} from "./Constants";
import {
  getConvexStakedRecords,
  getERC20,
  getERC20TokenRecordsFromWallets,
  getLiquityStabilityPoolRecords,
  getOnsenAllocatorRecords,
  getRariAllocatorRecords,
  getVeFXSAllocatorRecords,
} from "./ContractHelper";
import { getLiquidityBalances } from "./LiquidityCalculations";
import { getUSDRate } from "./Price";
import { addToMetricName, combineTokenRecords, newTokenRecords } from "./TokenRecordHelper";

/**
 * Returns the token records for a given stablecoin. This includes:
 * - Wallets
 * - Allocators
 * - Liquidity pools
 *
 * @param contractAddress the address of the ERC20 contract
 * @param blockNumber the current block
 * @returns TokenRecords object
 */
export function getStablecoinBalance(
  metricName: string,
  contractAddress: string,
  includeLiquidity: boolean,
  riskFree: boolean,
  excludeOhmValue: boolean,
  restrictToTokeValue: boolean,
  blockNumber: BigInt,
): TokenRecords {
  const contractName = getContractName(contractAddress);
  log.info(
    "getStablecoinBalance: Calculating stablecoin balance for {} ({}) at block number {}: liquidity? {}, risk-free? {}, exclude OHM value? {}, restrictToTokenValue? {}",
    [
      contractName,
      contractAddress,
      blockNumber.toString(),
      includeLiquidity ? "true" : "false",
      riskFree ? "true" : "false",
      excludeOhmValue ? "true" : "false",
      restrictToTokeValue ? "true" : "false",
    ],
  );
  const records = newTokenRecords(
    addToMetricName(metricName, "StablecoinBalance-" + contractName),
    blockNumber,
  );
  const contract = getERC20(contractAddress, blockNumber);
  if (!contract) {
    log.info("getStablecoinBalance: Skipping ERC20 contract {} that returned empty at block {}", [
      getContractName(contractAddress),
      blockNumber.toString(),
    ]);
    return records;
  }

  const rate = getUSDRate(contractAddress, blockNumber);

  // Wallets
  combineTokenRecords(
    records,
    getERC20TokenRecordsFromWallets(records.id, contractAddress, contract, rate, blockNumber),
  );

  // Rari Allocator
  combineTokenRecords(
    records,
    getRariAllocatorRecords(records.id, contractAddress, rate, blockNumber),
  );

  // Staked Convex tokens
  combineTokenRecords(records, getConvexStakedRecords(records.id, contractAddress, blockNumber));

  // Liquity Stability Pool
  combineTokenRecords(
    records,
    getLiquityStabilityPoolRecords(records.id, contractAddress, rate, blockNumber),
  );

  // Onsen Allocator
  combineTokenRecords(
    records,
    getOnsenAllocatorRecords(records.id, contractAddress, rate, blockNumber),
  );

  // VeFXS Allocator
  combineTokenRecords(records, getVeFXSAllocatorRecords(records.id, contractAddress, blockNumber));

  // Liquidity pools
  if (includeLiquidity) {
    combineTokenRecords(
      records,
      getLiquidityBalances(
        records.id,
        contractAddress,
        riskFree,
        excludeOhmValue,
        restrictToTokeValue,
        blockNumber,
      ),
    );
  }

  log.info("getStablecoinBalance: Stablecoin token value: {}", [records.value.toString()]);
  return records;
}

/**
 * Gets the balances for all stablecoins, using {getStablecoinBalance}.
 *
 * @param blockNumber the current block
 * @returns TokenRecords object
 */
export function getStablecoinBalances(
  metricName: string,
  includeLiquidity: boolean,
  riskFree: boolean,
  excludeOhmValue: boolean,
  restrictToTokenValue: boolean,
  blockNumber: BigInt,
): TokenRecords {
  log.info(
    "getStablecoinBalances: Calculating stablecoin value. Liquidity? {}. Risk-Free Value? {}.",
    [includeLiquidity ? "true" : "false", riskFree ? "true" : "false"],
  );
  const records = newTokenRecords(addToMetricName(metricName, "StablecoinBalances"), blockNumber);

  for (let i = 0; i < ERC20_STABLE_TOKENS.length; i++) {
    combineTokenRecords(
      records,
      getStablecoinBalance(
        records.id,
        ERC20_STABLE_TOKENS[i],
        includeLiquidity,
        riskFree,
        excludeOhmValue,
        restrictToTokenValue,
        blockNumber,
      ),
    );
  }

  log.info("getStablecoinBalances: Stablecoin value: {}", [records.value.toString()]);
  return records;
}

/**
 * Calculates the balance of DAI/aDAI across the following:
 * - all wallets, using {getERC20TokenRecordsFromWallets}.
 * - Aave allocator
 * - Aave allocator v2
 * - Rari allocator
 *
 * @param blockNumber the current block number
 * @returns TokenRecords object
 */
export function getDaiBalance(metricName: string, blockNumber: BigInt): TokenRecords {
  const records = newTokenRecords(addToMetricName(metricName, "DAIBalance"), blockNumber);

  combineTokenRecords(
    records,
    getStablecoinBalance(records.id, ERC20_DAI, false, false, false, false, blockNumber),
  );
  combineTokenRecords(
    records,
    getStablecoinBalance(records.id, ERC20_ADAI, false, false, false, false, blockNumber),
  );

  return records;
}

/**
 * Calculates the balance of FEI across the following:
 * - all wallets, using {getERC20TokenRecordsFromWallets}.
 *
 * @param blockNumber the current block number
 * @returns TokenRecords object
 */
export function getFeiBalance(metricName: string, blockNumber: BigInt): TokenRecords {
  return getStablecoinBalance(metricName, ERC20_FEI, false, false, false, false, blockNumber);
}

/**
 * Calculates the balance of FRAX across the following:
 * - all wallets, using {getERC20TokenRecordsFromWallets}.
 * - Convex allocators
 *
 * @param blockNumber the current block number
 * @returns TokenRecords object
 */
export function getFraxBalance(metricName: string, blockNumber: BigInt): TokenRecords {
  return getStablecoinBalance(metricName, ERC20_FRAX, false, false, false, false, blockNumber);
}

/**
 * Returns the balance of LUSD tokens in the following:
 * - all wallets, using {getERC20TokenRecordsFromWallets}.
 * - LUSD allocator
 *
 * @param blockNumber the current block number
 * @returns TokenRecords object
 */
export function getLUSDBalance(metricName: string, blockNumber: BigInt): TokenRecords {
  return getStablecoinBalance(metricName, ERC20_LUSD, false, false, false, false, blockNumber);
}

/**
 * Returns the balance of UST tokens in the following:
 * - all wallets, using {getERC20TokenRecordsFromWallets}.
 *
 * NOTE: this is currently set to 0, due to issues with the price of UST.
 *
 * @param blockNumber the current block number
 * @returns TokenRecords object
 */
export function getUSTBalance(metricName: string, blockNumber: BigInt): TokenRecords {
  return getStablecoinBalance(metricName, ERC20_UST, false, false, false, false, blockNumber);
}

/**
 * Returns the value of USD-pegged stablecoins, excluding any liquidity pools.
 *
 * This currently (incorrectly) assumes that the value of each stablecoin is $1.
 *
 * @param blockNumber the current block number
 * @returns TokenRecords representing the components of the stablecoin value
 */
export function getStableValue(metricName: string, blockNumber: BigInt): TokenRecords {
  return getStablecoinBalances(metricName, false, false, false, false, blockNumber);
}

/**
 * Returns the DAI/aDAI market value, which is defined as:
 * - DAI balance
 * - DAI in liquidity pairs
 *
 * If {riskFree} is true, the discounted value of OHM-DAI pairs (where OHM = $1)
 * is calculated.
 *
 * @param blockNumber the current block number
 * @param riskFree true if calculating the risk-free value
 * @returns TokenRecords representing the components of the market value
 */
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export function getDaiMarketValue(
  metricName: string,
  blockNumber: BigInt,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  riskFree: boolean = false,
): TokenRecords {
  log.info("getDaiMarketValue: Calculating DAI market value", []);
  const records = newTokenRecords(addToMetricName(metricName, "DAIMarketValue"), blockNumber);

  combineTokenRecords(
    records,
    getStablecoinBalance(records.id, ERC20_DAI, true, riskFree, false, true, blockNumber),
  );
  combineTokenRecords(
    records,
    getStablecoinBalance(records.id, ERC20_ADAI, true, riskFree, false, true, blockNumber),
  );

  log.info("getDaiMarketValue: DAI market value: {}", [records.value.toString()]);
  return records;
}

/**
 * Returns the FRAX market value, which is defined as:
 * - Balance of FRAX
 * - FRAX in liquidity pairs
 *
 * If {riskFree} is true, the discounted value of OHM-DAI pairs (where OHM = $1)
 * is calculated.
 *
 * @param blockNumber the current block number
 * @param riskFree true if calculating the risk-free value
 * @returns TokenRecords representing the components of the market value
 */
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export function getFraxMarketValue(
  metricName: string,
  blockNumber: BigInt,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  riskFree: boolean = false,
): TokenRecords {
  return getStablecoinBalance(metricName, ERC20_FRAX, true, riskFree, false, true, blockNumber);
}

/**
 * Returns the LUSD market value, which is defined as:
 * - Balance of LUSD
 * - LUSD in liquidity pairs
 *
 * If {riskFree} is true, the discounted value of OHM-DAI pairs (where OHM = $1)
 * is calculated.
 *
 * @param blockNumber the current block number
 * @param riskFree true if calculating the risk-free value
 * @returns TokenRecords representing the components of the market value
 */
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export function getLusdMarketValue(
  metricName: string,
  blockNumber: BigInt,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  riskFree: boolean = false,
): TokenRecords {
  return getStablecoinBalance(metricName, ERC20_LUSD, true, riskFree, false, true, blockNumber);
}

/**
 * Returns the FEI market value, which is defined as:
 * - Balance of FEI
 * - FEI in liquidity pairs
 *
 * If {riskFree} is true, the discounted value of OHM-DAI pairs (where OHM = $1)
 * is calculated.
 *
 * @param blockNumber the current block number
 * @param riskFree true if calculating the risk-free value
 * @returns TokenRecords representing the components of the market value
 */
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export function getFeiMarketValue(
  metricName: string,
  blockNumber: BigInt,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  riskFree: boolean = false,
): TokenRecords {
  return getStablecoinBalance(metricName, ERC20_FEI, true, riskFree, false, true, blockNumber);
}
