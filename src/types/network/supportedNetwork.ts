import { ImageFileType } from "../style/imageFileType";
import NETWORK_ETHEREUM from "assets/icons/network/circle/Ethereum_circle.svg";
import SYMBOL_TITAN from "assets/icons/network/circle/Titan_circle.svg";
import SYMBOL_THANOS from "assets/icons/network/circle/Thanos_circle.svg";
import SYMBOL_LEGACY_TITAN from "assets/icons/network/circle/Legacy_titan_circle.svg"

import { SupportedTokenSymbol } from "@/types/token/supportedToken";

export enum SupportedChainId {
  MAINNET = 1,
  //   ARBITRUM_ONE = 42161,
  //   ARBITRUM_GOERLI = 421613,
  //   OPTIMISM = 10,
  //   OPTIMISM_GOERLI = 420,
  //   POLYGON = 137,
  //   POLYGON_MUMBAI = 80001,
  //   CELO = 42220,
  //   CELO_ALFAJORES = 44787,
  //   BNB = 56,
  TITAN = 55004,
  SEPOLIA = 11155111,
  THANOS_SEPOLIA = 111551119090,
  TITAN_SEPOLIA = 55007,
}

export enum SupportedL2ChainId {
  TITAN = 55004,
  THANOS_SEPOLIA = 111551119090,
  TITAN_SEPOLIA = 55007,
}

export enum SupportedChainIdOnProd {
  MAINNET = 1,
  TITAN = 55004,
  SEPOLIA = 11155111,
  TITAN_SEPOLIA = 55007,
  // THANOS_SEPOLIA = 111551119090,
}

export const NetworkDisplayName: Partial<
  Record<string | SupportedChainId, string>
> = {
  MAINNET: "Ethereum",
  TITAN: "Titan",
  SEPOLIA: "Sepolia",
  THANOS_SEPOLIA: "Thanos Sepolia",
  TITAN_SEPOLIA: "Titan Sepolia",
  LEGACY_TITAN_SEPOLIA: "Legacy Titan Sepolia",
};

export interface SupportedChainProperties {
  chainId: SupportedChainId;
  chainName: keyof typeof SupportedChainId;
  rpcAddress: string;
  networkImage: ImageFileType;
  nativeToken: SupportedTokenSymbol;
  isTokamak?: boolean;
  layer: "L1" | "L2";
  isTOP?: boolean;
  isTestnet?: boolean;
}

export const supportedChain: SupportedChainProperties[] = [
  {
    chainId: SupportedChainId.MAINNET,
    chainName: "MAINNET",
    networkImage: NETWORK_ETHEREUM,
    rpcAddress: "",
    nativeToken: "ETH",
    layer: "L1",
  },
  {
    chainId: SupportedChainId.SEPOLIA,
    chainName: "SEPOLIA",
    networkImage: NETWORK_ETHEREUM,
    rpcAddress: "",
    nativeToken: "ETH",
    layer: "L1",
    isTestnet: true,
  },
  {
    chainId: SupportedChainId.TITAN,
    chainName: "TITAN",
    networkImage: SYMBOL_LEGACY_TITAN,
    rpcAddress: "",
    nativeToken: "TON",
    isTokamak: true,
    layer: "L2",
    isTOP: true,
  },
  {
    chainId: SupportedChainId.THANOS_SEPOLIA,
    chainName: "THANOS_SEPOLIA",
    networkImage: SYMBOL_THANOS,
    rpcAddress: "",
    nativeToken: "TON",
    layer: "L2",
    isTOP: true,
    isTestnet: true,
  },
  {
    chainId: SupportedChainId.TITAN_SEPOLIA,
    chainName: "TITAN_SEPOLIA",
    networkImage: SYMBOL_LEGACY_TITAN,
    rpcAddress: "",
    nativeToken: "ETH",
    layer: "L2",
    isTestnet: true,
  },
];

export const supportedChainOnProd = supportedChain.filter((chain: any) =>
  Object.values(SupportedChainIdOnProd).includes(chain.chainId)
);

export const isLayer1Chain = (chainId: SupportedChainId): boolean => {
  return (
    supportedChain.find((chain) => chain.chainId === chainId)?.layer === "L1"
  );
};

export const isLayer2Chain = (chainId: SupportedChainId): boolean => {
  return (
    supportedChain.find((chain) => chain.chainId === chainId)?.layer === "L2"
  );
};
