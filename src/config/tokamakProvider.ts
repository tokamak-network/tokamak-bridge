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

export const titan_goerli = {
  id: 5050,
  name: "Titan Goerli",
  network: "Titan Goerli",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [process.env.NEXT_PUBLIC_TITAN_GOERLI_RPC as string] },
    default: { http: [process.env.NEXT_PUBLIC_TITAN_GOERLI_RPC as string] },
  },
  blockExplorers: {
    etherscan: {
      name: "BlockScout",
      url: "https://explorer.titan-goerli.tokamak.network",
    },
    default: {
      name: "BlockScout",
      url: "https://explorer.titan-goerli.tokamak.network",
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
