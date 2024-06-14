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

interface BaseTransactionHistory {
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

// 타입 가드 추가
export function isWithdrawTransactionHistory(
  transaction: TransactionHistory
): transaction is WithdrawTransactionHistory {
  return transaction.action === Action.Withdraw;
}
