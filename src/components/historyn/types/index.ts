import { TokenInfo } from "types/token/supportedToken";

export enum Action {
  Withdraw = "Withdraw",
  Deposit = "Deposit",
}

export enum Status {
  Initial = "Initial",
  Rollup = "Rollup",
  Finalized = "Finalized",
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

interface WithdrawTransactionHistory extends BaseTransactionHistory {
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

interface DepositTransactionHistory extends BaseTransactionHistory {
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
