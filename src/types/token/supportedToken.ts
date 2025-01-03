import { ZERO_ADDRESS } from "@/constant/misc";
import { SupportedChainId } from "../network/supportedNetwork";
import {
  MAINNET_CONTRACTS,
  TOKAMAK_CONTRACTS,
  SEPOLIA_CONTRACTS,
  THANOS_SEPOLIA_CONTRACTS,
  TITAN_SEPOLIA_CONTRACTS,
} from "@/contracts/index";

type SupportedMainTokenNames = "Tokamak Network Token" | "Wrapped TON" | "ETH";
type SupportedStableTokenNames = "USD//C";

export type SupportedTokenNames =
  | SupportedMainTokenNames
  | SupportedStableTokenNames;

type SupportedMainTokens = "TON" | "TOS" | "WTON" | "ETH";
type SupportedStableTokens = "USDC";

export type SupportedTokenSymbol = SupportedMainTokens | SupportedStableTokens;

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
    tokenName: "Ethereum",
    tokenSymbol: "ETH",
    address: {
      MAINNET: "",
      TITAN: TOKAMAK_CONTRACTS.OVM_ETH,
      SEPOLIA: "",
      THANOS_SEPOLIA: THANOS_SEPOLIA_CONTRACTS.ETH_ADDRESS,
      TITAN_SEPOLIA: TITAN_SEPOLIA_CONTRACTS.OVM_ETH,
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
    tokenName: "Wrapped Ethereum",
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
};

export const L2_TITAN_SEPOLIA_TokenWhitelistForCT = {
  TON: TITAN_SEPOLIA_CONTRACTS.TON_ADDRESS,
  USDT: TITAN_SEPOLIA_CONTRACTS.USDT_ADDRESS,
  USDC: TITAN_SEPOLIA_CONTRACTS.USDC_ADDRESS,
};

export const supportedTokensForCt: {
  [key: number]: {
    [token: string]: {
      address: string;
      decimals: number;
    };
  };
} = {
  [SupportedChainId.MAINNET]: {
    TON: {
      address: MAINNET_CONTRACTS.TON_ADDRESS,
      decimals: 18,
    },
    USDC: {
      address: MAINNET_CONTRACTS.USDC_ADDRESS,
      decimals: 6,
    },
    USDT: {
      address: MAINNET_CONTRACTS.USDT_ADDRESS,
      decimals: 6,
    },
    ETH: {
      address: ZERO_ADDRESS,
      decimals: 18,
    },
  },
  [SupportedChainId.SEPOLIA]: {
    TON: {
      address: SEPOLIA_CONTRACTS.TON_ADDRESS,
      decimals: 18,
    },
    USDC: {
      address: SEPOLIA_CONTRACTS.USDC_ADDRESS,
      decimals: 6,
    },
    USDT: {
      address: SEPOLIA_CONTRACTS.USDT_ADDRESS,
      decimals: 6,
    },
    ETH: {
      address: "",
      decimals: 18,
    },
  },
  [SupportedChainId.TITAN]: {
    TON: {
      address: TOKAMAK_CONTRACTS.TON_ADDRESS,
      decimals: 18,
    },
    USDC: {
      address: TOKAMAK_CONTRACTS.USDC_ADDRESS,
      decimals: 6,
    },
    USDT: {
      address: TOKAMAK_CONTRACTS.USDT_ADDRESS,
      decimals: 6,
    },
    ETH: {
      address: TOKAMAK_CONTRACTS.OVM_ETH,
      decimals: 18,
    },
  },
  [SupportedChainId.TITAN_SEPOLIA]: {
    TON: {
      address: TITAN_SEPOLIA_CONTRACTS.TON_ADDRESS,
      decimals: 18,
    },
    USDC: {
      address: TITAN_SEPOLIA_CONTRACTS.USDC_ADDRESS,
      decimals: 6,
    },
    USDT: {
      address: TITAN_SEPOLIA_CONTRACTS.USDT_ADDRESS,
      decimals: 6,
    },
    ETH: {
      address: TITAN_SEPOLIA_CONTRACTS.OVM_ETH,
      decimals: 18,
    },
  },
  [SupportedChainId.THANOS_SEPOLIA]: {
    TON: {
      address: THANOS_SEPOLIA_CONTRACTS.TON_ADDRESS,
      decimals: 18,
    },
    USDC: {
      address: THANOS_SEPOLIA_CONTRACTS.USDC_ADDRESS,
      decimals: 6,
    },
    USDT: {
      address: THANOS_SEPOLIA_CONTRACTS.USDT_ADDRESS,
      decimals: 6,
    },
    ETH: {
      address: THANOS_SEPOLIA_CONTRACTS.ETH_ADDRESS,
      decimals: 18,
    },
  },
};
