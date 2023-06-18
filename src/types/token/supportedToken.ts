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

export const WETH_ADDRESSES = ["0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"];

export type SupportedTokens_T = TokenInfo[];
export const supportedTokens: SupportedTokens_T = [
  {
    tokenName: "ETH",
    tokenSymbol: "ETH",
    address: {
      MAINNET: "0x",
      GOERLI: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      TITAN: "0x",
      DARIUS: "0x",
    },
    decimals: 18,
    isNativeCurrency: [
      SupportedChainId.MAINNET,
      SupportedChainId.GOERLI,
      SupportedChainId.TITAN,
    ],
  },
  {
    tokenName: "Tokamak Network Token",
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
      TITAN: TOKAMAK_CONTRACTS.WTON_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.WTON_ADDRESS,
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
      TITAN: TOKAMAK_CONTRACTS.DOC_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.DOC_ADDRESS,
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
      TITAN: TOKAMAK_CONTRACTS.AURA_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.AURA_ADDRESS,
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
      TITAN: TOKAMAK_CONTRACTS.LYDA_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.LYDA_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "USD//C",
    tokenSymbol: "USDC",
    address: {
      MAINNET: null,
      GOERLI: GOERLI_CONTRACTS.USDC_ADDRESS,
      TITAN: TOKAMAK_CONTRACTS.USDC_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.USDC_ADDRESS,
    },
    decimals: 6,
    isNativeCurrency: null,
  },
];
