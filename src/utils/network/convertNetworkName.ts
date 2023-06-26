import { SupportedChainId } from "@/types/network/supportedNetwork";

export function convertNetworkName(params: keyof typeof SupportedChainId) {
  switch (params) {
    case "MAINNET":
      return "Ethereum Mainnet";
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
