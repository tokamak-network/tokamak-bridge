import { ImageFileType } from "../style/imageFileType";
import SYMBOL_ETH from "assets/tokens/eth.svg";
import SYMBOL_TON from "assets/tokens/ton.svg";
import { SupportedTokenName } from "@/types/token/supportedToken";

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
  TOKAMAK_MAINNET = 5051,
  TOKAMAK_OPTIMISM_GOERLI = 5050,
}

export interface SupportedChainProperties {
  chainId: SupportedChainId;
  chainName: string;
  rpcAddress: string;
  networkImage: ImageFileType;
  nativeToken: SupportedTokenName;
  isTokamak?: boolean;
}

export const supportedChain: SupportedChainProperties[] = [
  {
    chainId: SupportedChainId.MAINNET,
    chainName: "Ethereum Mainnet",
    networkImage: SYMBOL_ETH,
    rpcAddress: "",
    nativeToken: "ETH",
  },
  {
    chainId: SupportedChainId.GOERLI,
    chainName: "Goerli",
    networkImage: SYMBOL_ETH,
    rpcAddress: "",
    nativeToken: "ETH",
  },
  {
    chainId: SupportedChainId.TOKAMAK_MAINNET,
    chainName: "Tokamak Network",
    networkImage: SYMBOL_TON,
    rpcAddress: "",
    nativeToken: "TON",
    isTokamak: true,
  },
  {
    chainId: SupportedChainId.TOKAMAK_OPTIMISM_GOERLI,
    chainName: "Tokamak_Goerli",
    networkImage: SYMBOL_TON,
    rpcAddress: "",
    nativeToken: "TON",
    isTokamak: true,
  },
];
