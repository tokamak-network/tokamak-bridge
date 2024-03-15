import { SupportedChainProperties } from "../network/supportedNetwork";

export type ActionMode =
  | "Swap"
  | "Deposit"
  | "Withdraw"
  | "Pool"
  | "Wrap"
  | "Unwrap"
  | "ETH-Wrap"
  | "ETH-Unwrap"
  | null;
export type InOutNetworks = {
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
};

export enum ActionMethod {
  Deposit = "Deposit",
  Withdraw = "Withdraw",
  Swap_ETH = "Swap",
  Swap_Titan = "Swap",
  Pool = "Pool"
}