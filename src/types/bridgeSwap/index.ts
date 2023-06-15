import { SupportedChainProperties } from "../network/supportedNetwork";

export type ActionMode = "Swap" | "Deposit" | "Withdraw" | "Pool" | null;
export type InOutNetworks = {
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
};
