import { SupportedChainProperties } from "../network/supportedNetwork";

export type ActionMode = "Swap" | "Deposit" | "Withdraw" | null;
export type InOutNetworks = {
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
};
