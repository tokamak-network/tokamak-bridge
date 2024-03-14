import { SupportedChainId } from "@/types/network/supportedNetwork";

export function checkLayer(chainId: number | undefined) {
  if (
    chainId === SupportedChainId["MAINNET"] ||
    chainId === SupportedChainId["GOERLI"]
  )
    return "L1";
  if (
    chainId === SupportedChainId["TITAN"] ||
    chainId === SupportedChainId["DARIUS"]
  )
    return "L2";
  return undefined;
}
