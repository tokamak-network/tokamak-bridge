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
const SepoliaProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_SEPOLIA_RPC
);
const ThanosSepoliaProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_THANOS_SEPOLIA_RPC
);

const providers: {
  [K in keyof typeof SupportedChainId]: ethers.providers.JsonRpcProvider;
} = {
  MAINNET: EthereumProvider,
  GOERLI: GoerliProvider,
  TITAN: TitanProvider,
  DARIUS: TitanGoerliProvider,
  SEPOLIA: SepoliaProvider,
  THANOS_SEPOLIA: ThanosSepoliaProvider,
};

export function getProvider(inNetwork: SupportedChainProperties | null) {
  if (inNetwork === null) {
    return;
  }
  return providers[inNetwork.chainName];
}

export const providerByChainId: Record<
  number,
  ethers.providers.JsonRpcProvider
> = {
  [SupportedChainId.MAINNET]: EthereumProvider,
  [SupportedChainId.GOERLI]: GoerliProvider,
  [SupportedChainId.TITAN]: TitanProvider,
  [SupportedChainId.DARIUS]: TitanGoerliProvider,
  [SupportedChainId.SEPOLIA]: SepoliaProvider,
};
