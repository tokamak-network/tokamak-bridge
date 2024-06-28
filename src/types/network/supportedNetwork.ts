import { ImageFileType } from "../style/imageFileType";
import NETWORK_ETHEREUM from "assets/icons/network/circle/Ethereum_circle.svg";
import SYMBOL_TITAN from "assets/icons/network/darius.svg";
import SYMBOL_THANOS from "assets/icons/network/Thanos.svg";

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
  THANOS_SEPOLIA = 111551118080,
  TITAN_SEPOLIA = 55007,
}

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
    networkImage: SYMBOL_TITAN,
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
    networkImage: SYMBOL_TITAN,
    rpcAddress: "",
    nativeToken: "ETH",
    layer: "L2",
    isTestnet: true,
  },
];

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
