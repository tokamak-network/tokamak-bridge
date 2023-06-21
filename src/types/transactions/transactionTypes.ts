import { TradeType } from "@uniswap/sdk-core";
import { InOutNetworks } from "../bridgeSwap";
import { SupportedChainProperties } from "../network/supportedNetwork";

export interface SerializableTransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  blockHash: string;
  transactionHash: string;
  blockNumber: number;
  status?: number;
}

export enum TransactionType {
  APPROVAL = 'APPROVAL', //approve tokens
  SWAP = 'SWAP', 
  WRAP = 'WRAP', 
  UNWRAP  = 'UNWRAP', 
  WITHDRAW = 'WITHDRAW', // withdraw from L2
  DEPOSIT = 'DEPOSIT', // deposit to L2
  MINT = 'MINT', //
  ADD_LIQUIDITY = 'ADD_LIQUIDITY', //increase liquidity 
  REMOVE_LIQUIDITY = 'REMOVE_LIQUIDITY', // decrease liquidity
  COLLECT_FEES = 'COLLECT_FEES', //
}

interface BaseTransactionInfo {
  type: TransactionType;
}

export interface ApproveTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.APPROVAL;
  tokenAddress: string;
  spender: string;
  amount: string;
}

interface BaseSwapTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.SWAP;
  tradeType: TradeType;
  inputCurrencyId: string;
  outputCurrencyId: string;
}

export interface ExactInputSwapTransactionInfo extends BaseSwapTransactionInfo {
  tradeType: TradeType.EXACT_INPUT;
  inputCurrencyAmountRaw: string;
  expectedOutputCurrencyAmountRaw: string;
  minimumOutputCurrencyAmountRaw: string;
}

export interface DepositLiquidityStakingTransactionInfo {
  type: TransactionType.DEPOSIT;
  token0Address: string;
  inNetwork: SupportedChainProperties  | null;
  outNetwork: SupportedChainProperties  | null;
  currencyAmountRaw: string;
}

export interface WithdrawLiquidityStakingTransactionInfo {
  type: TransactionType.WITHDRAW;
  token0Address: string;
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
  currencyAmountRaw: string;
}

export interface WrapTransactionInfo {
  type: TransactionType.WRAP;
  unwrapped: boolean;
  currencyAmountRaw: string;
  chainId?: number;
  inputCurrencyId: string;
  outputCurrencyId: string;
}

export interface UnwrapTransactionInfo {
  type: TransactionType.UNWRAP;
  unwrapped: boolean;
  currencyAmountRaw: string;
  chainId?: number;
  inputCurrencyId: string;
  outputCurrencyId: string;
}

export interface AddLiquidityV3PoolTransactionInfo {
  type: TransactionType.ADD_LIQUIDITY;
  createPool: boolean;
  baseCurrencyId: string;
  quoteCurrencyId: string;
  feeAmount: number;
  expectedAmountBaseRaw: string;
  expectedAmountQuoteRaw: string;
 
}

export interface RemoveLiquidityV3TransactionInfo {
  type: TransactionType.REMOVE_LIQUIDITY;
  baseCurrencyId: string;
  quoteCurrencyId: string;
  expectedAmountBaseRaw: string;
  expectedAmountQuoteRaw: string;
}

export interface CollectFeesTransactionInfo {
  type: TransactionType.COLLECT_FEES;
  currencyId0: string;
  currencyId1: string;
  expectedCurrencyOwed0: string;
  expectedCurrencyOwed1: string;
}

export interface CreateV3PoolTransactionInfo {
  type: TransactionType.MINT;
  baseCurrencyId: string;
  quoteCurrencyId: string;
}

export type TransactionInfo =
  | ApproveTransactionInfo
  | ExactInputSwapTransactionInfo
  | DepositLiquidityStakingTransactionInfo
  | WithdrawLiquidityStakingTransactionInfo
  | WrapTransactionInfo
  |UnwrapTransactionInfo
  | CreateV3PoolTransactionInfo
  | AddLiquidityV3PoolTransactionInfo
  | CollectFeesTransactionInfo
  | RemoveLiquidityV3TransactionInfo

