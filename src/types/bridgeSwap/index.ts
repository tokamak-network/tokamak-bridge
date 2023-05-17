import { SupportedChainProperties } from "../network/supportedNetwork";

export type ActionMode = "Swap" | "Deposit" | null;
export type InOutNetworks = {
  inNetwork: SupportedChainProperties | null;
  outNetwork: SupportedChainProperties | null;
};
