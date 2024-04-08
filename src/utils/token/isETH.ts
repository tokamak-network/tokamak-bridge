import {
  GOERLI_CONTRACTS,
  MAINNET_CONTRACTS,
  SEPOLIA_CONTRACTS,
  THANOS_SEPOLIA_CONTRACTS,
  TOKAMAK_CONTRACTS,
  TOKAMAK_GOERLI_CONTRACTS,
  TITAN_SEPOLIA_CONTRACTS,
} from "@/constant/contracts";
import {
  SupportedChainId,
  SupportedChainProperties,
} from "@/types/network/supportedNetwork";
import { TokenInfo } from "@/types/token/supportedToken";

export function isETH(token: TokenInfo | null) {
  if (token === null) return false;
  return token?.isNativeCurrency?.includes(
    SupportedChainId.MAINNET ||
      SupportedChainId.SEPOLIA ||
      SupportedChainId.TITAN ||
      SupportedChainId.TITAN_SEPOLIA
  );
}

export function getWETHAddress(
  chainName: SupportedChainProperties["chainName"]
) {
  const wethAddress: { [K in SupportedChainProperties["chainName"]]: string } =
    {
      MAINNET: MAINNET_CONTRACTS.WETH_ADDRESS,
      TITAN: TOKAMAK_CONTRACTS.WETH_ADDRESS,
      SEPOLIA: SEPOLIA_CONTRACTS.WETH_ADDRESS,
      THANOS_SEPOLIA: THANOS_SEPOLIA_CONTRACTS.WTON_ADDRESS,
      TITAN_SEPOLIA: TITAN_SEPOLIA_CONTRACTS.WETH_ADDRESS,
    };

  return wethAddress[chainName];
}

export function getWETHAddressByChainId(chainId: number) {
  const wethAddress: Record<number, string> = {
    [1]: MAINNET_CONTRACTS.WETH_ADDRESS,
    [5]: GOERLI_CONTRACTS.WETH_ADDRESS,
    [55004]: TOKAMAK_CONTRACTS.WETH_ADDRESS,
    [5050]: TOKAMAK_GOERLI_CONTRACTS.WETH_ADDRESS,
    [11155111]: SEPOLIA_CONTRACTS.WETH_ADDRESS,
    [55007]: TITAN_SEPOLIA_CONTRACTS.WETH_ADDRESS,
  };

  return wethAddress[chainId];
}
