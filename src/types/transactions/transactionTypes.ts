import { TradeType } from "@uniswap/sdk-core";
import { InOutNetworks } from "../bridgeSwap";
import { SupportedChainProperties } from "../network/supportedNetwork";
import { Token } from "@uniswap/sdk-core";
import { SelectedToken } from "@/recoil/bridgeSwap/atom";
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
  token: Token | undefined;
  spender: string;
  amount: string;
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
}

interface BaseSwapTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.SWAP;
  tradeType: TradeType;
  inputCurrency: Token  | undefined;
  outputCurrency: Token  | undefined;
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
}

export interface ExactInputSwapTransactionInfo extends BaseSwapTransactionInfo {
  inputCurrencyAmountRaw: string;
  expectedOutputCurrencyAmountRaw: string;
  minimumOutputCurrencyAmountRaw: string;
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
}

export interface DepositLiquidityStakingTransactionInfo {
  type: TransactionType.DEPOSIT;
  token0: SelectedToken  | null;
  inNetwork: SupportedChainProperties  | null;
  outNetwork: SupportedChainProperties  | null;
  currencyAmountRaw: string;
  
}

export interface WithdrawLiquidityStakingTransactionInfo {
  type: TransactionType.WITHDRAW;
  token0:  SelectedToken  | null;
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
  currencyAmountRaw: string;
}

export interface WrapTransactionInfo {
  type: TransactionType.WRAP;
  unwrapped: boolean;
  currencyAmountRaw: string;
  chainId?: number;
  inputCurrency: Token  | undefined;
  outputCurrency: Token  | undefined;
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
}

export interface UnwrapTransactionInfo {
  type: TransactionType.UNWRAP;
  unwrapped: boolean;
  currencyAmountRaw: string;
  chainId?: number;
  inputCurrency: Token  | undefined;
  outputCurrency: Token  | undefined;
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
}

export interface AddLiquidityV3PoolTransactionInfo {
  type: TransactionType.ADD_LIQUIDITY;
  createPool: boolean;
  baseCurrency: Token  | undefined;
  quoteCurrency: Token | undefined;
  feeAmount: number;
  expectedAmountBaseRaw: string;
  expectedAmountQuoteRaw: string;
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
 
}

export interface RemoveLiquidityV3TransactionInfo {
  type: TransactionType.REMOVE_LIQUIDITY;
  baseCurrency: Token | undefined;
  quoteCurrency: Token | undefined;
  expectedAmountBaseRaw: string;
  expectedAmountQuoteRaw: string;
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
}

export interface CollectFeesTransactionInfo {
  type: TransactionType.COLLECT_FEES;
  currencyId0: Token | undefined;
  currencyId1: Token | undefined;
  expectedCurrencyOwed0: Token | undefined;
  expectedCurrencyOwed1: Token | undefined;
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
}

export interface CreateV3PoolTransactionInfo {
  type: TransactionType.MINT;
  baseCurrency: Token | undefined;
  quoteCurrency: Token  | undefined;
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
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

