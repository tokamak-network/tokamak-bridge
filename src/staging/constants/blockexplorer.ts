// This can be moved to an env file later
export const BLOCKEXPLORER_CONSTANTS = {
  MAINNET:
    process.env.NEXT_PUBLIC_ETHEREUM_BLOCKEXPLORER || "https://etherscan.io",
  SEPOLIA:
    process.env.NEXT_PUBLIC_SEPOLIA_BLOCKEXPLORER ||
    "https://sepolia.etherscan.io",
  TITAN_SEPOLIA:
    process.env.NEXT_PUBLIC_TITAN_SEPOLIA_BLOCKEXPLORER ||
    "https://explorer.titan-sepolia.tokamak.network",
  TITAN:
    process.env.NEXT_PUBLIC_TITAN_BLOCKEXPLORER ||
    "https://explorer.titan.tokamak.network",
  THANOS_SEPOLIA:
    process.env.NEXT_PUBLIC_THANOS_SEPOLIA_BLOCKEXPLORER ||
    "https://explorer.thanos-sepolia.tokamak.network",
  THANOS:
    process.env.NEXT_PUBLIC_THANOS_BLOCKEXPLORER ||
    "https://explorer.thanos.tokamak.network",
};
