import { SupportedChainId } from "@/types/network/supportedNetwork";

export const rollupTime = {
  //take 11 mins to rollup to finish and 7 days for the challenge period
  [SupportedChainId.MAINNET]: 11 * 60 + 7 * 24 * 60 * 60,
  [SupportedChainId.SEPOLIA]: 2 * 60 + 10 + 150,
};
