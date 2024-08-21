import { THANOS_SEPOLIA_CHAIN_ID } from "@/constant/network/thanos";
import { SupportedChainProperties } from "@/types/network/supportedNetwork";

export const isThanosSepolia = (chain: SupportedChainProperties | null) => {
  if (!chain) return false;
  return chain.chainId === THANOS_SEPOLIA_CHAIN_ID;
};
