import { ImageFileType } from "../style/imageFileType";
import SYMBOL_ETH from "assets/tokens/eth.svg";
import SYMBOL_TON from "assets/tokens/ton.svg";

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
  isTokamak?: boolean;
}

export const supportedChain: SupportedChainProperties[] = [
  {
    chainId: SupportedChainId.MAINNET,
    chainName: "Ethereum",
    networkImage: SYMBOL_ETH,
    rpcAddress: "",
  },
  {
    chainId: SupportedChainId.GOERLI,
    chainName: "Goerli",
    networkImage: SYMBOL_ETH,
    rpcAddress: "",
  },
  {
    chainId: SupportedChainId.TOKAMAK_MAINNET,
    chainName: "Tokamak_Mainnet",
    networkImage: SYMBOL_TON,
    rpcAddress: "",
    isTokamak: true,
  },
  {
    chainId: SupportedChainId.TOKAMAK_OPTIMISM_GOERLI,
    chainName: "Tokamak_Goerli",
    networkImage: SYMBOL_TON,
    rpcAddress: "",
    isTokamak: true,
  },
];
