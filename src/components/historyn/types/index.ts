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

export interface TransactionHistory {
  action: Action;
  status: Status;
  blockTimestamp: string;
  inNetwork: Network;
  outNetwork: Network;
  tokenSymbol: TokenInfo["tokenSymbol"];
  amount: string;
  transactionHash: string;
}
