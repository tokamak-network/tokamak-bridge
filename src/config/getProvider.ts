import {
  SupportedChainId,
  SupportedChainProperties,
} from "@/types/network/supportedNetwork";
import { ethers } from "ethers";

const EthereumProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_ETHEREUM_RPC
);
const GoerliProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_GOERLI_RPC
);
const TitanProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_TITAN_RPC
);
const TitanGoerliProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_TITAN_GOERLI_RPC
);

const providers: {
  [K in keyof typeof SupportedChainId]: ethers.providers.JsonRpcProvider;
} = {
  MAINNET: EthereumProvider,
  GOERLI: GoerliProvider,
  TITAN: TitanProvider,
  DARIUS: TitanGoerliProvider,
};

export function getProvider(inNetwork: SupportedChainProperties | null) {
  if (inNetwork === null) {
    return;
  }
  return providers[inNetwork.chainName];
}
