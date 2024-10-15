import { SupportedChainId } from "@/types/network/supportedNetwork";

export function checkLayer(chainId: number | undefined) {
  if (chainId === SupportedChainId["MAINNET"]) return "L1";
  if (chainId === SupportedChainId["TITAN"]) return "L2";
  return undefined;
}
