import { SupportedChainId, supportedChainOnProd } from "@/types/network/supportedNetwork";

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

export const isSupportedOnProd = (chainId: SupportedChainId | null) => {
  if(!chainId) return false;
  return supportedChainOnProd.find((chain) => chain.chainId === chainId);
}