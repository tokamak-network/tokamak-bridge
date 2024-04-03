import { SupportedChainId } from "@/types/network/supportedNetwork";

export function convertNetworkName(
  params: keyof typeof SupportedChainId | undefined
) {
  switch (params) {
    case "MAINNET":
      return "Ethereum";
    case "SEPOLIA":
      return "Sepolia";
    case "TITAN":
      return "Titan";
    case "THANOS_SEPOLIA":
      return "Thanos Sepolia";
    case "TITAN_SEPOLIA":
      return "Titan Sepolia";
    default:
      return null;
  }
}
