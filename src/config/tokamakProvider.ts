import { Chain } from "wagmi";

export const titan = {
  id: 55004,
  name: "Titan",
  network: "Titan",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [process.env.NEXT_PUBLIC_TITAN_RPC as string] },
    default: { http: [process.env.NEXT_PUBLIC_TITAN_RPC as string] },
  },
  blockExplorers: {
    etherscan: {
      name: "Titan Mainnet Explorer",
      url: process.env.NEXT_PUBLIC_TITAN_BLOCKEXPLORER as string,
    },
    default: {
      name: "Titan Mainnet Explorer",
      url: process.env.NEXT_PUBLIC_TITAN_BLOCKEXPLORER as string,
    },
  },
} as const satisfies Chain;

export const titan_sepolia = {
  id: 55007,
  name: "Titan Sepolia",
  network: "Titan Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [process.env.NEXT_PUBLIC_TITAN_SEPOLIA_RPC as string] },
    default: { http: [process.env.NEXT_PUBLIC_TITAN_SEPOLIA_RPC as string] },
  },
  blockExplorers: {
    etherscan: {
      name: "BlockScout",
      url: "https://explorer.titan-sepolia.tokamak.network",
    },
    default: {
      name: "BlockScout",
      url: "https://explorer.titan-sepolia.tokamak.network",
    },
  },
} as const satisfies Chain;

export const thanos_sepolia = {
  id: 111551118080,
  name: "Thanos Sepolia",
  network: "Thanos Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "TON",
    symbol: "TON",
  },
  rpcUrls: {
    public: { http: [process.env.NEXT_PUBLIC_THANOS_SEPOLIA_RPC as string] },
    default: { http: [process.env.NEXT_PUBLIC_THANOS_SEPOLIA_RPC as string] },
  },
  blockExplorers: {
    etherscan: {
      name: "BlockScout",
      url: "https://explorer.thanos-sepolia-test.tokamak.network",
    },
    default: {
      name: "BlockScout",
      url: "https://explorer.thanos-sepolia-test.tokamak.network",
    },
  },
} as const satisfies Chain;

export const Mainnet = {
  id: 1,
  name: "Ethereum",
  network: "Ethereum",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [process.env.NEXT_PUBLIC_ETHEREUM_RPC as string] },
    default: { http: [process.env.NEXT_PUBLIC_ETHEREUM_RPC as string] },
  },
  blockExplorers: {
    etherscan: {
      name: "Etherscan",
      url: "https://etherscan.io",
    },
    default: {
      name: "Etherscan",
      url: "https://etherscan.io",
    },
  },
} as const satisfies Chain;
