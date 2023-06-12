import { SupportedChainId } from "../network/supportedNetwork";
import {
  MAINNET_CONTRACTS,
  GOERLI_CONTRACTS,
  TOKAMAK_CONTRACTS,
  TOKAMAK_GOERLI_CONTRACTS,
} from "@/contracts/index";

type SupportedMainTokens = "TON" | "TOS" | "WTON" | "ETH";
type SupportedEcosystemTokens = "DOC" | "AURA" | "LYDA";
type SupportedStableTokens = "USDC";

export type SupportedTokenName =
  | SupportedMainTokens
  | SupportedEcosystemTokens
  | SupportedStableTokens;

export type TokenInfo = {
  tokenName: SupportedTokenName | String | string;
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
    address: {
      MAINNET: "0x",
      GOERLI: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      TOKAMAK_MAINNET: "0x",
      DARIUS: "0x",
    },
    decimals: 18,
    isNativeCurrency: [SupportedChainId.MAINNET, SupportedChainId.GOERLI],
  },
  {
    tokenName: "TON",
    address: {
      MAINNET: MAINNET_CONTRACTS.TON_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.TON_ADDRESS,
      TOKAMAK_MAINNET: TOKAMAK_CONTRACTS.TON_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.TON_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: [
      SupportedChainId.TOKAMAK_MAINNET,
      SupportedChainId.DARIUS,
    ],
  },
  {
    tokenName: "WTON",
    address: {
      MAINNET: MAINNET_CONTRACTS.WTON_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.WTON_ADDRESS,
      TOKAMAK_MAINNET: TOKAMAK_CONTRACTS.WTON_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.WTON_ADDRESS,
    },
    decimals: 27,
    isNativeCurrency: null,
  },

  {
    tokenName: "TOS",
    address: {
      MAINNET: MAINNET_CONTRACTS.TOS_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.TOS_ADDRESS,
      TOKAMAK_MAINNET: TOKAMAK_CONTRACTS.TOS_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.TOS_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "DOC",
    address: {
      MAINNET: MAINNET_CONTRACTS.DOC_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.DOC_ADDRESS,
      TOKAMAK_MAINNET: TOKAMAK_CONTRACTS.DOC_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.DOC_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "AURA",
    address: {
      MAINNET: MAINNET_CONTRACTS.AURA_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.AURA_ADDRESS,
      TOKAMAK_MAINNET: TOKAMAK_CONTRACTS.AURA_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.AURA_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "LYDA",
    address: {
      MAINNET: MAINNET_CONTRACTS.LYDA_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.LYDA_ADDRESS,
      TOKAMAK_MAINNET: TOKAMAK_CONTRACTS.LYDA_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.LYDA_ADDRESS,
    },
    decimals: 18,
    isNativeCurrency: null,
  },
  {
    tokenName: "USDC",
    address: {
      MAINNET: null,
      GOERLI: GOERLI_CONTRACTS.USDC_ADDRESS,
      TOKAMAK_MAINNET: TOKAMAK_CONTRACTS.USDC_ADDRESS,
      DARIUS: TOKAMAK_GOERLI_CONTRACTS.USDC_ADDRESS,
    },
    decimals: 6,
    isNativeCurrency: null,
  },
];
