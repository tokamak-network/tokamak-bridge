import { ImageFileType } from "../style/imageFileType";
import NETWORK_ETHEREUM from "assets/icons/network/circle/Ethereum_circle.svg";
import SYMBOL_TITAN from "assets/icons/network/darius.svg";

import { SupportedTokenSymbol } from "@/types/token/supportedToken";

export enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,
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
  DARIUS = 5050,
}

export interface SupportedChainProperties {
  chainId: SupportedChainId;
  chainName: keyof typeof SupportedChainId;
  rpcAddress: string;
  networkImage: ImageFileType;
  nativeToken: SupportedTokenSymbol;
  isTokamak?: boolean;
  layer: "L1" | "L2";
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
    chainId: SupportedChainId.GOERLI,
    chainName: "GOERLI",
    networkImage: NETWORK_ETHEREUM,
    rpcAddress: "",
    nativeToken: "ETH",
    layer: "L1",
  },
  {
    chainId: SupportedChainId.TITAN,
    chainName: "TITAN",
    networkImage: SYMBOL_TITAN,
    rpcAddress: "",
    nativeToken: "TON",
    isTokamak: true,
    layer: "L2",
  },
  {
    chainId: SupportedChainId.DARIUS,
    chainName: "DARIUS",
    networkImage: SYMBOL_TITAN,
    rpcAddress: "",
    nativeToken: "TON",
    isTokamak: true,
    layer: "L2",
  },
];
