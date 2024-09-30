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

export const formatNetworkName = (variable: string) => {
  if (!variable.includes("_")) {
    return variable.charAt(0).toUpperCase() + variable.slice(1).toLowerCase();
  }
  return variable?.replace(/([A-Z]+)_([A-Z]+)/g, (_, p1, p2) => {
    return (
      p1.charAt(0) +
      p1.slice(1).toLowerCase() +
      " " +
      p2.charAt(0) +
      p2.slice(1).toLowerCase()
    );
  });
};
