import { SupportedChainId } from "@/types/network/supportedNetwork";

export function convertNetworkName(
  params: keyof typeof SupportedChainId | undefined
) {
  switch (params) {
    case "MAINNET":
      return "Ethereum";
    case "TITAN":
      return "Titan";
    default:
      return null;
  }
}
