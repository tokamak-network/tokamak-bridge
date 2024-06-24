import { inTokenSelector } from "@/recoil/bridgeSwap/atom";
import { TokenInfo } from "types/token/supportedToken";

export enum Action {
  Withdraw = "Withdraw",
  Deposit = "Deposit",
}

export enum Status {
  Initiate = "Initiate",
  Rollup = "Rollup",
  Prove = "Prove",
  Finalize = "Finalize",
  Completed = "Completed",
}

export enum Network {
  Mainnet = "MAINNET",
  Sepolia = "SEPOLIA",
  TitanSepolia = "TITAN_SEPOLIA",
  Titan = "TITAN",
  Thanos = "THANOS",
  ThanosSepolia = "THANOS_SEPOLIA",
}

export interface TransactionToken {
  address: string;
  name: string;
  symbol: string;
  amount: string;
  decimals: number;
}

export interface BaseTransactionHistory {
  action: Action;
  status: Status;
  inNetwork: Network;
  outNetwork: Network;
  inToken: TransactionToken;
  outToken: TransactionToken;
  errorMessage?: string | null;
}

export interface WithdrawTransactionHistory extends BaseTransactionHistory {
  action: Action.Withdraw;
  status: Status;
  blockTimestamps: {
    initialCompletedTimestamp: number;
    rollupCompletedTimestamp?: number;
    finalizedCompletedTimestamp?: number;
  };
  transactionHashes: {
    initialTransactionHash: string;
    rollupTransactionHash?: string;
    finalizedTransactionHash?: string;
  };
}

export interface DepositTransactionHistory extends BaseTransactionHistory {
  action: Action.Deposit;
  blockTimestamps: {
    initialCompletedTimestamp: number;
    finalizedCompletedTimestamp?: number;
  };
  transactionHashes: {
    initialTransactionHash: string;
    finalizedTransactionHash?: string;
  };
}

export type TransactionHistory =
  | WithdrawTransactionHistory
  | DepositTransactionHistory;

export function isWithdrawTransactionHistory(
  transaction: TransactionHistory
): transaction is WithdrawTransactionHistory {
  return (
    transaction.action === Action.Withdraw &&
    "transactionHashes" in transaction &&
    "initialTransactionHash" in transaction.transactionHashes &&
    "blockTimestamps" in transaction &&
    "initialCompletedTimestamp" in transaction.blockTimestamps
  );
}

export function isDepositTransactionHistory(
  transaction: TransactionHistory
): transaction is DepositTransactionHistory {
  return (
    transaction.action === Action.Deposit &&
    "transactionHashes" in transaction &&
    "initialTransactionHash" in transaction.transactionHashes &&
    "blockTimestamps" in transaction &&
    "initialCompletedTimestamp" in transaction.blockTimestamps
  );
}

export interface GasCostData {
  withdrawInitiateGasCostText?: string;
  withdrawInitiateGasCostUS?: string;
  withdrawClaimGasCostText?: string;
  withdrawClaimGasCostUS?: string;
  depositInitiateGasCostText?: string;
  depositGasCostUS?: string;
}
