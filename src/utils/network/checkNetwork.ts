import { SupportedChainId } from "@/types/network/supportedNetwork";

export const isThanosChain = (chainId: SupportedChainId | null | undefined) => {
  if (!chainId) return false;
  return chainId === SupportedChainId.THANOS_SEPOLIA;
};

export const isTitanChain = (chainId: SupportedChainId | null | undefined) => {
  if (!chainId) return false;
  return (
    chainId === SupportedChainId.TITAN ||
    chainId === SupportedChainId.TITAN_SEPOLIA
  );
};
