import { Chain } from "wagmi";

export const tokamak_goerli = {
  id: 5050,
  name: "tokamak_goerli",
  network: "tokamak_goerli",
  nativeCurrency: {
    decimals: 18,
    name: "tokamak_goerli_eth",
    symbol: "tokamak_goerli_eth",
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
