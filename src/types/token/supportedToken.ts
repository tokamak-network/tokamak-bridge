import { SupportedChainId } from "../network/supportedNetwork";
import {
  MAINNET_CONTRACTS,
  GOERLI_CONTRACTS,
  TOKAMAK_CONTRACTS,
  TOKAMAK_GOERLI_CONTRACTS,
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
};

export type SupportedTokens_T = TokenInfo[];

export const supportedTokens: SupportedTokens_T = [
  {
    tokenName: "ETH",
    tokenSymbol: "ETH",
    address: {
      MAINNET: MAINNET_CONTRACTS.WETH_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.WETH_ADDRESS,
      TITAN: TOKAMAK_CONTRACTS.OVM_ETH,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.OVM_ETH,
    },
    decimals: 18,
    isNativeCurrency: [
      SupportedChainId.MAINNET,
      SupportedChainId.GOERLI,
      SupportedChainId.TITAN,
    ],
  },
  {
    tokenName: "WETH",
    tokenSymbol: "WETH",
    address: {
      MAINNET: MAINNET_CONTRACTS.WETH_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.WETH_ADDRESS,
      TITAN: null,
      DARIUS: null,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "Tokamak Network",
    tokenSymbol: "TON",
    address: {
      MAINNET: MAINNET_CONTRACTS.TON_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.TON_ADDRESS,
      TITAN: TOKAMAK_CONTRACTS.TON_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.TON_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: null,
    // isNativeCurrency: [
    //   SupportedChainId.TITAN,
    //   SupportedChainId.DARIUS,
    // ],
  },
  {
    tokenName: "Wrapped TON",
    tokenSymbol: "WTON",
    address: {
      MAINNET: MAINNET_CONTRACTS.WTON_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.WTON_ADDRESS,
      TITAN: null,
      DARIUS: null,
    },
    decimals: 27,
    isNativeCurrency: null,
  },

  {
    tokenName: "TONStarter",
    tokenSymbol: "TOS",
    address: {
      MAINNET: MAINNET_CONTRACTS.TOS_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.TOS_ADDRESS,
      TITAN: TOKAMAK_CONTRACTS.TOS_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.TOS_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "Dooropen",
    tokenSymbol: "DOC",
    address: {
      MAINNET: MAINNET_CONTRACTS.DOC_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.DOC_ADDRESS,
      TITAN: null,
      DARIUS: null,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "AURA",
    tokenSymbol: "AURA",
    address: {
      MAINNET: MAINNET_CONTRACTS.AURA_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.AURA_ADDRESS,
      TITAN: null,
      DARIUS: null,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "LYDA",
    tokenSymbol: "LYDA",
    address: {
      MAINNET: MAINNET_CONTRACTS.LYDA_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.LYDA_ADDRESS,
      TITAN: null,
      DARIUS: null,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "USDC",
    tokenSymbol: "USDC",
    address: {
      MAINNET: MAINNET_CONTRACTS.USDC_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.USDC_ADDRESS,
      TITAN: TOKAMAK_CONTRACTS.USDC_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.USDC_ADDRESS,
    },
    decimals: 6,
    isNativeCurrency: null,
  },
  {
    tokenName: "USDT",
    tokenSymbol: "USDT",
    address: {
      MAINNET: MAINNET_CONTRACTS.USDT_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.USDT_ADDRESS,
      TITAN: TOKAMAK_CONTRACTS.USDT_ADDRES,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.USDT_ADDRES,
    },
    decimals: 6,
    isNativeCurrency: null,
  },
];
