import { TokenInfo } from "types/token/supportedToken";

export enum Action {
  Withdraw = "Withdraw",
  Deposit = "Deposit",
}

export enum Status {
  Initiate = "Initiate",
  Rollup = "Rollup",
  Finalize = "Finalize",
  Completed = "Completed",
}

export enum Network {
  Mainnet = "MAINNET",
  Sepolia = "SEPOLIA",
  TitanSepolia = "TITAN_SEPOLIA",
  Titan = "TITAN",
}

export interface BaseTransactionHistory {
  action: Action;
  status: Status;
  inNetwork: Network;
  outNetwork: Network;
  tokenSymbol: TokenInfo["tokenSymbol"];
  amount: string;
  errorMessage?: string | null;
}

export interface WithdrawTransactionHistory extends BaseTransactionHistory {
  action: Action.Withdraw;
  blockTimestamps: {
    initialCompletedTimestamp: string;
    rollupCompletedTimestamp?: string;
    finalizedCompletedTimestamp?: string;
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
    initialCompletedTimestamp: string;
    finalizedCompletedTimestamp?: string;
  };
  transactionHashes: {
    initialTransactionHash: string;
    finalizedTransactionHash?: string;
  };
}

export type TransactionHistory =
  | BaseTransactionHistory
  | WithdrawTransactionHistory
  | DepositTransactionHistory;

export enum TransactionStatus {
  Initiate = 0,
  WithdrawRollup = 1,
  WithdrawFinalized = 2,
  WithdrawCompleted = 3,
  DepositFinalized = 10,
  DepositCompleted = 11,
}

export function isWithdrawTransactionHistory(
  transaction: TransactionHistory
): transaction is WithdrawTransactionHistory {
  return (
    transaction.action === Action.Withdraw &&
    "blockTimestamps" in transaction &&
    "transactionHashes" in transaction &&
    "rollupCompletedTimestamp" in transaction.blockTimestamps
  );
}

export function isDepositTransactionHistory(
  transaction: TransactionHistory
): transaction is DepositTransactionHistory {
  return (
    transaction.action === Action.Deposit &&
    "blockTimestamps" in transaction &&
    "transactionHashes" in transaction &&
    !("rollupCompletedTimestamp" in transaction.blockTimestamps)
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
