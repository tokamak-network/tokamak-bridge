import { SupportedChainId } from "../network/supportedNetwork";
import {
  MAINNET_CONTRACTS,
  TOKAMAK_CONTRACTS,
  SEPOLIA_CONTRACTS,
  THANOS_SEPOLIA_CONTRACTS,
  TITAN_SEPOLIA_CONTRACTS,
} from "@/contracts/index";

type SupportedMainTokenNames =
  | "Tokamak Network Token"
  | "Wrapped TON"
  | "TONStarter"
  | "ETH";
type SupportedEcosystemTokenNames = "Dooropen" | "AURA" | "LYDA";
type SupportedStableTokenNames = "USD//C";

export type SupportedTokenNames =
  | SupportedMainTokenNames
  | SupportedEcosystemTokenNames
  | SupportedStableTokenNames;

type SupportedMainTokens = "TON" | "TOS" | "WTON" | "ETH";
type SupportedEcosystemTokens = "DOC" | "AURA" | "LYDA";
type SupportedStableTokens = "USDC";

export type SupportedTokenSymbol =
  | SupportedMainTokens
  | SupportedEcosystemTokens
  | SupportedStableTokens;

export type TokenInfo = {
  tokenName: SupportedTokenNames | String | string;
  tokenSymbol: SupportedTokenSymbol | String | string;
  address: {
    [K in keyof typeof SupportedChainId]: `0x${string}` | string | null;
  };
  decimals: number;
  isNativeCurrency: SupportedChainId[] | null;
  availableForBirdge?: boolean;
  isNew?: boolean;
  isLiked?: "true" | "false" | "none" | String | string;
};

export type SupportedTokens_T = TokenInfo[];

export const supportedTokens: SupportedTokens_T = [
  {
    tokenName: "ETH",
    tokenSymbol: "ETH",
    address: {
      MAINNET: "",
      TITAN: TOKAMAK_CONTRACTS.WETH_ADDRESS,
      SEPOLIA: "",
      THANOS_SEPOLIA: THANOS_SEPOLIA_CONTRACTS.ETH_ADDRESS,
      TITAN_SEPOLIA: TITAN_SEPOLIA_CONTRACTS.WETH_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: [
      SupportedChainId.MAINNET,
      SupportedChainId.TITAN,
      SupportedChainId.THANOS_SEPOLIA,
      SupportedChainId.TITAN_SEPOLIA,
    ],
    availableForBirdge: true,
  },
  {
    tokenName: "WETH",
    tokenSymbol: "WETH",
    address: {
      MAINNET: MAINNET_CONTRACTS.WETH_ADDRESS,
      TITAN: TOKAMAK_CONTRACTS.WETH_ADDRESS,
      SEPOLIA: SEPOLIA_CONTRACTS.WETH_ADDRESS,
      THANOS_SEPOLIA: THANOS_SEPOLIA_CONTRACTS.WTON_ADDRESS,
      TITAN_SEPOLIA: TITAN_SEPOLIA_CONTRACTS.WETH_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "Tokamak Network",
    tokenSymbol: "TON",
    address: {
      MAINNET: MAINNET_CONTRACTS.TON_ADDRESS,
      TITAN: TOKAMAK_CONTRACTS.TON_ADDRESS,
      SEPOLIA: SEPOLIA_CONTRACTS.TON_ADDRESS,
      THANOS_SEPOLIA: THANOS_SEPOLIA_CONTRACTS.ETH_ADDRESS,
      TITAN_SEPOLIA: TITAN_SEPOLIA_CONTRACTS.TON_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: null,
    availableForBirdge: true,
  },
  {
    tokenName: "Wrapped TON",
    tokenSymbol: "WTON",
    address: {
      MAINNET: MAINNET_CONTRACTS.WTON_ADDRESS,
      TITAN: null,
      SEPOLIA: SEPOLIA_CONTRACTS.WTON_ADDRESS,
      THANOS_SEPOLIA: THANOS_SEPOLIA_CONTRACTS.WTON_ADDRESS,
      TITAN_SEPOLIA: null,
    },
    decimals: 27,
    isNativeCurrency: null,
  },

  {
    tokenName: "TONStarter",
    tokenSymbol: "TOS",
    address: {
      MAINNET: MAINNET_CONTRACTS.TOS_ADDRESS,
      TITAN: TOKAMAK_CONTRACTS.TOS_ADDRESS,
      SEPOLIA: SEPOLIA_CONTRACTS.TOS_ADDRESS,
      THANOS_SEPOLIA: THANOS_SEPOLIA_CONTRACTS.TOS_ADDRESS,
      TITAN_SEPOLIA: TITAN_SEPOLIA_CONTRACTS.TOS_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: null,
    availableForBirdge: true,
  },
  {
    tokenName: "Dooropen",
    tokenSymbol: "DOC",
    address: {
      MAINNET: MAINNET_CONTRACTS.DOC_ADDRESS,
      TITAN: null,
      SEPOLIA: SEPOLIA_CONTRACTS.DOC_ADDRESS,
      THANOS_SEPOLIA: THANOS_SEPOLIA_CONTRACTS.DOC_ADDRESS,
      TITAN_SEPOLIA: TITAN_SEPOLIA_CONTRACTS.DOC_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "Dragons of Midgard",
    tokenSymbol: "AURA",
    address: {
      MAINNET: MAINNET_CONTRACTS.AURA_ADDRESS,
      TITAN: null,
      SEPOLIA: SEPOLIA_CONTRACTS.AURA_ADDRESS,
      THANOS_SEPOLIA: THANOS_SEPOLIA_CONTRACTS.AURA_ADDRESS,
      TITAN_SEPOLIA: TITAN_SEPOLIA_CONTRACTS.AURA_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "LYDA",
    tokenSymbol: "LYDA",
    address: {
      MAINNET: MAINNET_CONTRACTS.LYDA_ADDRESS,
      TITAN: null,
      SEPOLIA: SEPOLIA_CONTRACTS.LYDA_ADDRESS,
      THANOS_SEPOLIA: THANOS_SEPOLIA_CONTRACTS.LYDA_ADDRESS,
      TITAN_SEPOLIA: TITAN_SEPOLIA_CONTRACTS.LYDA_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "USD Coin",
    tokenSymbol: "USDC",
    address: {
      MAINNET: MAINNET_CONTRACTS.USDC_ADDRESS,
      TITAN: TOKAMAK_CONTRACTS.USDC_ADDRESS,
      SEPOLIA: SEPOLIA_CONTRACTS.USDC_ADDRESS,
      THANOS_SEPOLIA: THANOS_SEPOLIA_CONTRACTS.USDC_ADDRESS,
      TITAN_SEPOLIA: TITAN_SEPOLIA_CONTRACTS.USDC_ADDRESS,
    },
    decimals: 6,
    isNativeCurrency: null,
    availableForBirdge: true,
  },
  {
    tokenName: "Tether USD",
    tokenSymbol: "USDT",
    address: {
      MAINNET: MAINNET_CONTRACTS.USDT_ADDRESS,
      TITAN: TOKAMAK_CONTRACTS.USDT_ADDRESS,
      SEPOLIA: SEPOLIA_CONTRACTS.USDT_ADDRESS,
      THANOS_SEPOLIA: THANOS_SEPOLIA_CONTRACTS.USDT_ADDRESS,
      TITAN_SEPOLIA: TITAN_SEPOLIA_CONTRACTS.USDT_ADDRESS,
    },
    decimals: 6,
    isNativeCurrency: null,
    availableForBirdge: true,
  },
];

export const supportedTokensForCT = supportedTokens.filter(
  (token) =>
    token.tokenSymbol === "ETH" ||
    token.tokenSymbol === "TON" ||
    token.tokenSymbol === "TOS" ||
    token.tokenSymbol === "USDC" ||
    token.tokenSymbol === "USDT"
);

export const L1_SEPOLIA_TokenWhitelistForCT = {
  TON: SEPOLIA_CONTRACTS.TON_ADDRESS,
  USDT: SEPOLIA_CONTRACTS.USDT_ADDRESS,
  USDC: SEPOLIA_CONTRACTS.USDC_ADDRESS,
  TOS: SEPOLIA_CONTRACTS.TOS_ADDRESS,
};

export const L2_TITAN_SEPOLIA_TokenWhitelistForCT = {
  TON: TITAN_SEPOLIA_CONTRACTS.TON_ADDRESS,
  USDT: TITAN_SEPOLIA_CONTRACTS.USDT_ADDRESS,
  USDC: TITAN_SEPOLIA_CONTRACTS.USDC_ADDRESS,
  TOS: TITAN_SEPOLIA_CONTRACTS.TOS_ADDRESS,
};

// const supportedTokensForCt: {
//   [key in SupportedChainId]: {
//     [token: string]: {
//       address: string;
//       decimals: number;
//     };
//   };
// } = {
//   [SupportedChainId.MAINNET]: {
//     TON: {
//       address: MAINNET_CONTRACTS.TON_ADDRESS,
//       decimals: 18,
//     },
//     USDC: {
//       address: MAINNET_CONTRACTS.USDC_ADDRESS,
//       decimals: 6,
//     },
//     USDT: {
//       address: MAINNET_CONTRACTS.USDT_ADDRESS,
//       decimals: 6,
//     },
//     ETH: {
//       address: ZERO_ADDRESS,
//       decimals: 18,
//     },
//     TOS: {
//       address: MAINNET_CONTRACTS.TOS_ADDRESS,
//       decimals: 18,
//     },
//   },
//   [SupportedChainId.SEPOLIA]: {
//     TON: {
//       address: SEPOLIA_CONTRACTS.TON_ADDRESS,
//       decimals: 18,
//     },
//     USDC: {
//       address: SEPOLIA_CONTRACTS.USDC_ADDRESS,
//       decimals: 6,
//     },
//     USDT: {
//       address: SEPOLIA_CONTRACTS.USDT_ADDRESS,
//       decimals: 6,
//     },
//     ETH: {
//       address: "",
//       decimals: 18,
//     },
//     TOS: {
//       address: SEPOLIA_CONTRACTS.TOS_ADDRESS,
//       decimals: 18,
//     },
//   },
//   [SupportedChainId.TITAN]: {
//     TON: {
//       address: TOKAMAK_CONTRACTS.TON_ADDRESS,
//       decimals: 18,
//     },
//     USDC: {
//       address: TOKAMAK_CONTRACTS.USDC_ADDRESS,
//       decimals: 6,
//     },
//     USDT: {
//       address: TOKAMAK_CONTRACTS.USDT_ADDRESS,
//       decimals: 6,
//     },
//     ETH: {
//       address: TOKAMAK_CONTRACTS.OVM_ETH,
//       decimals: 18,
//     },
//     TOS: {
//       address: TOKAMAK_CONTRACTS.TOS_ADDRESS,
//       decimals: 18,
//     },
//   },
//   [SupportedChainId.TITAN_SEPOLIA]: {
//     TON: {
//       address: TITAN_SEPOLIA_CONTRACTS.TON_ADDRESS,
//       decimals: 18,
//     },
//     USDC: {
//       address: TITAN_SEPOLIA_CONTRACTS.USDC_ADDRESS,
//       decimals: 6,
//     },
//     USDT: {
//       address: TITAN_SEPOLIA_CONTRACTS.USDT_ADDRESS,
//       decimals: 6,
//     },
//     ETH: {
//       address: TITAN_SEPOLIA_CONTRACTS.OVM_ETH,
//       decimals: 18,
//     },
//     TOS: {
//       address: TITAN_SEPOLIA_CONTRACTS.TOS_ADDRESS,
//       decimals: 18,
//     },
//   },
//   [SupportedChainId.THANOS_SEPOLIA]: {
//     TON: {
//       address: THANOS_SEPOLIA_CONTRACTS.TON_ADDRESS,
//       decimals: 18,
//     },
//     USDC: {
//       address: THANOS_SEPOLIA_CONTRACTS.USDC_ADDRESS,
//       decimals: 6,
//     },
//     USDT: {
//       address: THANOS_SEPOLIA_CONTRACTS.USDT_ADDRESS,
//       decimals: 6,
//     },
//     ETH: {
//       address: THANOS_SEPOLIA_CONTRACTS.ETH_ADDRESS,
//       decimals: 18,
//     },
//     TOS: {
//       address: THANOS_SEPOLIA_CONTRACTS.TOS_ADDRESS,
//       decimals: 18,
//     },
//   },
// };
