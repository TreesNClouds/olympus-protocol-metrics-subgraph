import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";

import { ConvexAllocator } from "../../generated/ProtocolMetrics/ConvexAllocator";
import { ERC20 } from "../../generated/ProtocolMetrics/ERC20";
import { RariAllocator } from "../../generated/ProtocolMetrics/RariAllocator";
import { StabilityPool } from "../../generated/ProtocolMetrics/StabilityPool";
import {
  AAVE_ALLOCATOR,
  AAVE_ALLOCATOR_V2,
  AAVE_ALLOCATOR_V2_BLOCK,
  ADAI_ERC20_CONTRACT,
  CONVEX_ALLOCATOR1,
  CONVEX_ALLOCATOR1_BLOCK,
  CONVEX_ALLOCATOR2,
  CONVEX_ALLOCATOR2_BLOCK,
  CONVEX_ALLOCATOR3,
  CONVEX_ALLOCATOR3_BLOCK,
  ERC20DAI_CONTRACT,
  ERC20FRAX_CONTRACT,
  FEI_ERC20_CONTRACT,
  LUSD_ALLOCATOR,
  LUSD_ALLOCATOR_BLOCK,
  LUSD_ERC20_CONTRACT,
  LUSD_ERC20_CONTRACTV2_BLOCK,
  RARI_ALLOCATOR,
  RARI_ALLOCATOR_BLOCK,
  STABILITY_POOL,
  TREASURY_ADDRESS,
  TREASURY_ADDRESS_V2,
  TREASURY_ADDRESS_V3,
  UST_ERC20_CONTRACT,
  UST_ERC20_CONTRACT_BLOCK,
} from "./Constants";
import { getBalance, getConvexAllocator, getERC20, getRariAllocator, getStabilityPool } from "./ContractHelper";
import { toDecimal } from "./Decimals";
import { TokenRecord, TokenRecords, TokensRecords } from "./TokenRecord";

/**
 * Calculates the balance of DAI across the following:
 * - treasury address V1
 * - treasury address V2
 * - treasury address V3
 * - Aave allocator
 * - Aave allocator v2
 * - Rari allocator
 *
 * @param contracts object with bound contracts
 * @param blockNumber the current block number
 * @returns BigInt representing the balance
 */
export function getDaiBalance(
  daiERC20: ERC20,
  aDaiERC20: ERC20,
  rariAllocator: RariAllocator,
  blockNumber: BigInt
): TokenRecords {
  const sources = [
    new TokenRecord(
      "DAI",
      "Treasury Wallet",
      TREASURY_ADDRESS,
      BigDecimal.fromString("1"),
      toDecimal(getBalance(daiERC20, TREASURY_ADDRESS, blockNumber), 18)
    ),
    new TokenRecord(
      "DAI",
      "Treasury Wallet V2",
      TREASURY_ADDRESS_V2,
      BigDecimal.fromString("1"),
      toDecimal(getBalance(daiERC20, TREASURY_ADDRESS_V2, blockNumber), 18)
    ),
    new TokenRecord(
      "DAI",
      "Treasury Wallet V3",
      TREASURY_ADDRESS_V3,
      BigDecimal.fromString("1"),
      toDecimal(getBalance(daiERC20, TREASURY_ADDRESS_V3, blockNumber), 18)
    ),
    new TokenRecord(
      "DAI",
      "Aave Allocator",
      AAVE_ALLOCATOR,
      BigDecimal.fromString("1"),
      toDecimal(getBalance(aDaiERC20, AAVE_ALLOCATOR, blockNumber), 18)
    ),
    new TokenRecord(
      "DAI",
      "Aave Allocator V2",
      AAVE_ALLOCATOR_V2,
      BigDecimal.fromString("1"),
      toDecimal(
        getBalance(
          aDaiERC20,
          AAVE_ALLOCATOR_V2,
          blockNumber,
          BigInt.fromString(AAVE_ALLOCATOR_V2_BLOCK)
        ),
        18
      )
    ),
  ];

  // Rari allocator
  if (blockNumber.gt(BigInt.fromString(RARI_ALLOCATOR_BLOCK))) {
    sources.push(
      new TokenRecord(
        "DAI",
        "Rari Allocator",
        RARI_ALLOCATOR,
        BigDecimal.fromString("1"),
        toDecimal(rariAllocator.amountAllocated(BigInt.fromI32(3)), 18)
      )
    );
  }

  return new TokenRecords(sources);
}

/**
 * Calculates the balance of FEI across the following:
 * - treasury address V1
 * - treasury address V2
 * - treasury address V3
 *
 * @param contracts object with bound contracts
 * @param blockNumber the current block number
 * @returns BigInt representing the balance
 */
export function getFeiBalance(
  feiERC20: ERC20,
  blockNumber: BigInt
): TokenRecords {
  const sources = [
    new TokenRecord(
      "FEI",
      "Treasury Wallet",
      TREASURY_ADDRESS,
      BigDecimal.fromString("1"),
      toDecimal(getBalance(feiERC20, TREASURY_ADDRESS, blockNumber), 18)
    ),
    new TokenRecord(
      "FEI",
      "Treasury Wallet V2",
      TREASURY_ADDRESS_V2,
      BigDecimal.fromString("1"),
      toDecimal(getBalance(feiERC20, TREASURY_ADDRESS_V2, blockNumber), 18)
    ),
    new TokenRecord(
      "FEI",
      "Treasury Wallet V3",
      TREASURY_ADDRESS_V3,
      BigDecimal.fromString("1"),
      toDecimal(getBalance(feiERC20, TREASURY_ADDRESS_V3, blockNumber), 18)
    ),
  ];

  return new TokenRecords(sources);
}

/**
 * Calculates the balance of FRAX across the following:
 * - Convex allocator 1
 * - Convex allocator 2
 * - Convex allocator 3
 *
 * @param contracts object with bound contracts
 * @param blockNumber current block number
 * @returns BigInt representing the balance
 */
export function getFraxAllocatedInConvexBalance(
  allocator1: ConvexAllocator,
  allocator2: ConvexAllocator,
  allocator3: ConvexAllocator,
  blockNumber: BigInt
): TokenRecords {
  // TODO add to mv and mvrfv?
  const sources = [];

  // Multiplied by 10e9 for consistency
  // TODO determine if the multiplier is correct

  if (blockNumber.gt(BigInt.fromString(CONVEX_ALLOCATOR1_BLOCK))) {
    sources.push(
      new TokenRecord(
        "FRAX",
        "Convex Allocator 1",
        CONVEX_ALLOCATOR1,
        BigDecimal.fromString("1"),
        toDecimal(
          allocator1
            .totalValueDeployed()
            .times(BigInt.fromString("1000000000")),
          18
        )
      )
    );
  }

  if (blockNumber.gt(BigInt.fromString(CONVEX_ALLOCATOR2_BLOCK))) {
    sources.push(
      new TokenRecord(
        "FRAX",
        "Convex Allocator 2",
        CONVEX_ALLOCATOR2,
        BigDecimal.fromString("1"),
        toDecimal(
          allocator2
            .totalValueDeployed()
            .times(BigInt.fromString("1000000000")),
          18
        )
      )
    );
  }

  if (blockNumber.gt(BigInt.fromString(CONVEX_ALLOCATOR3_BLOCK))) {
    sources.push(
      new TokenRecord(
        "FRAX",
        "Convex Allocator 3",
        CONVEX_ALLOCATOR3,
        BigDecimal.fromString("1"),
        toDecimal(
          allocator3
            .totalValueDeployed()
            .times(BigInt.fromString("1000000000")),
          18
        )
      )
    );
  }

  return new TokenRecords(sources);
}

/**
 * Calculates the balance of FRAX across the following:
 * - treasury address V1
 * - treasury address V2
 * - treasury address V3
 * - Convex allocators
 *
 * @param contracts object with bound contracts
 * @param blockNumber the current block number
 * @returns BigInt representing the balance
 */
export function getFraxBalance(
  fraxERC20: ERC20,
  blockNumber: BigInt
): TokenRecords {
  const sources = [
    new TokenRecord(
      "FRAX",
      "Treasury Wallet",
      TREASURY_ADDRESS,
      BigDecimal.fromString("1"),
      toDecimal(getBalance(fraxERC20, TREASURY_ADDRESS, blockNumber), 18)
    ),
    new TokenRecord(
      "FRAX",
      "Treasury Wallet V2",
      TREASURY_ADDRESS_V2,
      BigDecimal.fromString("1"),
      toDecimal(getBalance(fraxERC20, TREASURY_ADDRESS_V2, blockNumber), 18)
    ),
    new TokenRecord(
      "FRAX",
      "Treasury Wallet V3",
      TREASURY_ADDRESS_V3,
      BigDecimal.fromString("1"),
      toDecimal(getBalance(fraxERC20, TREASURY_ADDRESS_V3, blockNumber), 18)
    ),
    ...getFraxAllocatedInConvexBalance(getConvexAllocator(CONVEX_ALLOCATOR1), getConvexAllocator(CONVEX_ALLOCATOR2), getConvexAllocator(CONVEX_ALLOCATOR3), blockNumber).records,
  ];

  return new TokenRecords(sources);
}

/**
 * Returns the balance of LUSD tokens in the following:
 * - treasury address V1
 * - treasury address V2
 * - treasury address V3
 * - LUSD allocator
 *
 * @param contracts object with bound contracts
 * @param blockNumber the current block number
 * @returns BigInt representing the balance
 */
export function getLUSDBalance(
  lusdERC20: ERC20,
  stabilityPoolContract: StabilityPool,
  blockNumber: BigInt
): TokenRecords {
  const sources = [
    new TokenRecord(
      "LUSD",
      "Treasury Wallet",
      TREASURY_ADDRESS,
      BigDecimal.fromString("1"),
      toDecimal(
        getBalance(
          lusdERC20,
          TREASURY_ADDRESS,
          blockNumber,
          BigInt.fromString(LUSD_ERC20_CONTRACTV2_BLOCK)
        ),
        18
      )
    ),
    new TokenRecord(
      "LUSD",
      "Treasury Wallet V2",
      TREASURY_ADDRESS_V2,
      BigDecimal.fromString("1"),
      toDecimal(
        getBalance(
          lusdERC20,
          TREASURY_ADDRESS_V2,
          blockNumber,
          BigInt.fromString(LUSD_ERC20_CONTRACTV2_BLOCK)
        ),
        18
      )
    ),
    new TokenRecord(
      "LUSD",
      "Treasury Wallet V3",
      TREASURY_ADDRESS_V3,
      BigDecimal.fromString("1"),
      toDecimal(
        getBalance(
          lusdERC20,
          TREASURY_ADDRESS_V3,
          blockNumber,
          BigInt.fromString(LUSD_ERC20_CONTRACTV2_BLOCK)
        ),
        18
      )
    ),
  ];

  if (blockNumber.gt(BigInt.fromString(LUSD_ALLOCATOR_BLOCK))) {
    sources.push(
      new TokenRecord(
        "LUSD",
        "LUSD Allocator",
        LUSD_ALLOCATOR,
        BigDecimal.fromString("1"),
        toDecimal(
          stabilityPoolContract.deposits(Address.fromString(LUSD_ALLOCATOR))
            .value0,
          18
        )
      )
    );
  }

  return new TokenRecords(sources);
}

/**
 * Returns the balance of UST tokens in the following:
 * - treasury address V1
 * - treasury address V2
 * - treasury address V3
 *
 * @param contracts object with bound contracts
 * @param blockNumber the current block number
 * @param treasury_address the v1 or v2 treasury address
 * @returns BigInt representing the balance
 */
export function getUSTBalance(
  ustERC20: ERC20,
  blockNumber: BigInt
): TokenRecords {
  const sources = [
    new TokenRecord(
      "UST",
      "Treasury Wallet",
      TREASURY_ADDRESS,
      BigDecimal.fromString("1"),
      toDecimal(
        getBalance(
          ustERC20,
          TREASURY_ADDRESS,
          blockNumber,
          BigInt.fromString(UST_ERC20_CONTRACT_BLOCK)
        ),
        18
      )
    ),
    new TokenRecord(
      "UST",
      "Treasury Wallet V2",
      TREASURY_ADDRESS_V2,
      BigDecimal.fromString("1"),
      toDecimal(
        getBalance(
          ustERC20,
          TREASURY_ADDRESS_V2,
          blockNumber,
          BigInt.fromString(UST_ERC20_CONTRACT_BLOCK)
        ),
        18
      )
    ),
    new TokenRecord(
      "UST",
      "Treasury Wallet V3",
      TREASURY_ADDRESS_V3,
      BigDecimal.fromString("1"),
      toDecimal(
        getBalance(
          ustERC20,
          TREASURY_ADDRESS_V3,
          blockNumber,
          BigInt.fromString(UST_ERC20_CONTRACT_BLOCK)
        ),
        18
      )
    ),
  ];

  return new TokenRecords(sources);
}

/**
 * Returns the value of USD-pegged stablecoins:
 * - DAI
 * - FRAX
 * - LUSD
 * - UST
 * - FEI
 *
 * This currently (incorrectly) assumes that the value of each stablecoin is $1.
 *
 * TODO: lookup stablecoin price
 *
 * @param contracts object with bound contracts
 * @param blockNumber the current block number
 * @returns BigDecimal representing the balance
 */
export function getStableValue(
  blockNumber: BigInt
): TokensRecords {
  const records = new TokensRecords();

  records.addToken("DAI", getDaiBalance(getERC20(ERC20DAI_CONTRACT), getERC20(ADAI_ERC20_CONTRACT), getRariAllocator(RARI_ALLOCATOR), blockNumber));
  records.addToken("FRAX", getFraxBalance(getERC20(ERC20FRAX_CONTRACT), blockNumber));
  records.addToken("UST", getUSTBalance(getERC20(UST_ERC20_CONTRACT), blockNumber));
  records.addToken("LUSD", getLUSDBalance(getERC20(LUSD_ERC20_CONTRACT), getStabilityPool(STABILITY_POOL), blockNumber));
  records.addToken("FEI", getFeiBalance(getERC20(FEI_ERC20_CONTRACT), blockNumber));

  log.debug("Stablecoin tokens: {}", [records.toString()]);
  return records;
}
