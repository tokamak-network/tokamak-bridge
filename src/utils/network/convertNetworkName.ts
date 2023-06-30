import { SupportedChainId } from "@/types/network/supportedNetwork";

export function convertNetworkName(
  params: keyof typeof SupportedChainId | undefined
) {
  switch (params) {
    case "MAINNET":
      return "Ethereum";
    case "GOERLI":
      return "Goerli";
    case "TITAN":
      return "Titan";
    case "DARIUS":
      return "Titan Goerli";
    default:
      return null;
  }
}
