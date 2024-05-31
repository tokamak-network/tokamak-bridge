import { TokenInfo } from "types/token/supportedToken";

export enum Action {
  Withdraw = "withdraw",
  Deposit = "deposit",
}

export enum Status {
  Initial = "initial",
  Rollup = "rollup",
  Finalized = "finalized",
  Complete = "complete",
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
