import { Chain } from "wagmi";

export const Titan = {
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

export const tokamak_goerli = {
  id: 5050,
  name: "Darius",
  network: "Darius",
  nativeCurrency: {
    decimals: 18,
    name: "Darius_ETH",
    symbol: "Darius_ETH",
  },
  rpcUrls: {
    public: { http: ["https://goerli.optimism.tokamak.network"] },
    default: { http: ["https://goerli.optimism.tokamak.network"] },
  },
  blockExplorers: {
    etherscan: {
      name: "BlockScout",
      url: "https://goerli.explorer.tokamak.network/",
    },
    default: {
      name: "BlockScout",
      url: "https://goerli.explorer.tokamak.network/",
    },
  },
} as const satisfies Chain;
