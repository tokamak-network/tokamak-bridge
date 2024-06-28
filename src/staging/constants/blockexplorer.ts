// This can be moved to an env file later
import { SupportedChainId } from "@/types/network/supportedNetwork";

export const BLOCKEXPLORER_CONSTANTS = {
  [SupportedChainId.MAINNET]:
    process.env.NEXT_PUBLIC_ETHEREUM_BLOCKEXPLORER || "https://etherscan.io",
  [SupportedChainId.SEPOLIA]:
    process.env.NEXT_PUBLIC_SEPOLIA_BLOCKEXPLORER ||
    "https://sepolia.etherscan.io",
  [SupportedChainId.TITAN_SEPOLIA]:
    process.env.NEXT_PUBLIC_TITAN_SEPOLIA_BLOCKEXPLORER ||
    "https://explorer.titan-sepolia.tokamak.network",
  [SupportedChainId.TITAN]:
    process.env.NEXT_PUBLIC_TITAN_BLOCKEXPLORER ||
    "https://explorer.titan.tokamak.network",
  [SupportedChainId.THANOS_SEPOLIA]:
    process.env.NEXT_PUBLIC_THANOS_SEPOLIA_BLOCKEXPLORER ||
    "https://explorer.thanos-sepolia.tokamak.network",
  [SupportedChainId.THANOS]:
    process.env.NEXT_PUBLIC_THANOS_BLOCKEXPLORER ||
    "https://explorer.thanos.tokamak.network",
};
