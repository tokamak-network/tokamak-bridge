import { SupportedChainId } from "../network/supportedNetwork";
import { MAINNET_CONTRACTS, GOERLI_CONTRACTS } from "@/contracts/index";

type SupportedMainTokens = "TON" | "TOS" | "WTON" | "ETH";
type SupportedEcosystemTokens = "DOC" | "AURA" | "LYDA";
type SupportedStableTokens = "USDC";

export type SupportedTokenName =
  | SupportedMainTokens
  | SupportedEcosystemTokens
  | SupportedStableTokens;

export type TokenInfo = {
  tokenName: SupportedTokenName | String;
  address: { [K in keyof typeof SupportedChainId]: `0x${string}` | null };
  decimals: number;
  isNativeCurrency: SupportedChainId[] | null;
};

export type SupportedTokens_T = TokenInfo[];
export const supportedTokens: SupportedTokens_T = [
  {
    tokenName: "ETH",
    address: {
      MAINNET: "0x",
      GOERLI: "0x",
      TOKAMAK_MAINNET: null,
      TOKAMAK_OPTIMISM_GOERLI: null,
    },
    decimals: 18,
    isNativeCurrency: [SupportedChainId.MAINNET, SupportedChainId.GOERLI],
  },
  {
    tokenName: "TON",
    address: {
      MAINNET: MAINNET_CONTRACTS.TON_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.TON_ADDRESS,
      TOKAMAK_MAINNET: null,
      TOKAMAK_OPTIMISM_GOERLI: null,
    },
    decimals: 18,
    isNativeCurrency: [
      SupportedChainId.TOKAMAK_MAINNET,
      SupportedChainId.TOKAMAK_OPTIMISM_GOERLI,
    ],
  },
  {
    tokenName: "WTON",
    address: {
      MAINNET: MAINNET_CONTRACTS.WTON_ADDRESS,
      GOERLI: GOERLI_CONTRACTS.WTON_ADDRESS,
      TOKAMAK_MAINNET: null,
      TOKAMAK_OPTIMISM_GOERLI: null,
    },
    decimals: 27,
    isNativeCurrency: null,
  },

  {
    tokenName: "TOS",
    address: {
      MAINNET: "0x",
      GOERLI: "0x",
      TOKAMAK_MAINNET: null,
      TOKAMAK_OPTIMISM_GOERLI: null,
    },
    decimals: 18,
    isNativeCurrency: [SupportedChainId.MAINNET, SupportedChainId.GOERLI],
  },
  {
    tokenName: "DOC",
    address: {
      MAINNET: "0x",
      GOERLI: "0x",
      TOKAMAK_MAINNET: null,
      TOKAMAK_OPTIMISM_GOERLI: null,
    },
    decimals: 18,
    isNativeCurrency: [SupportedChainId.MAINNET, SupportedChainId.GOERLI],
  },
  {
    tokenName: "AURA",
    address: {
      MAINNET: "0x",
      GOERLI: "0x",
      TOKAMAK_MAINNET: null,
      TOKAMAK_OPTIMISM_GOERLI: null,
    },
    decimals: 18,
    isNativeCurrency: [SupportedChainId.MAINNET, SupportedChainId.GOERLI],
  },
  {
    tokenName: "LYDA",
    address: {
      MAINNET: "0x",
      GOERLI: "0x",
      TOKAMAK_MAINNET: null,
      TOKAMAK_OPTIMISM_GOERLI: null,
    },
    decimals: 18,
    isNativeCurrency: [SupportedChainId.MAINNET, SupportedChainId.GOERLI],
  },
];
