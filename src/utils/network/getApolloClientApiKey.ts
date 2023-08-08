import { SupportedChainId } from "@/types/network/supportedNetwork";

export function getApolloClientApiKey(chainId: number | undefined) {
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return "";
    case SupportedChainId.GOERLI:
    case SupportedChainId.TITAN:
      return "titanSubGraph";
    case SupportedChainId.DARIUS:
      return "titanGoerliSubGraph";
    default:
      return undefined;
  }
}
