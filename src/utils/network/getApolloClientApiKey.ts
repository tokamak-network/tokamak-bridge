import { SupportedChainId } from "@/types/network/supportedNetwork";

export function getApolloClientApiKey(chainId: number | undefined) {
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return "";
    case SupportedChainId.TITAN:
      return "titanSubGraph";
    default:
      return undefined;
  }
}
