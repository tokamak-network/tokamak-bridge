import {
  MAINNET_CONTRACTS,
  SEPOLIA_CONTRACTS,
  THANOS_SEPOLIA_CONTRACTS,
  TOKAMAK_CONTRACTS,
  TITAN_SEPOLIA_CONTRACTS,
} from "@/constant/contracts";
import {
  SupportedChainId,
  SupportedChainProperties,
} from "@/types/network/supportedNetwork";
import { TokenInfo } from "@/types/token/supportedToken";

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
    [SupportedChainId.MAINNET]: MAINNET_CONTRACTS.WETH_ADDRESS,
    [SupportedChainId.TITAN]: TOKAMAK_CONTRACTS.WETH_ADDRESS,
    [SupportedChainId.SEPOLIA]: SEPOLIA_CONTRACTS.WETH_ADDRESS,
    [SupportedChainId.TITAN_SEPOLIA]: TITAN_SEPOLIA_CONTRACTS.WETH_ADDRESS,
  };

  return wethAddress[chainId];
}

export function isETH(token: TokenInfo | null) {
  if (token === null) return false;
  return token?.isNativeCurrency?.includes(
    SupportedChainId.MAINNET ||
      SupportedChainId.SEPOLIA ||
      SupportedChainId.TITAN ||
      SupportedChainId.TITAN_SEPOLIA
  );
}

export function isWETH(
  token: TokenInfo | null,
  chainName: SupportedChainProperties["chainName"] | undefined
) {
  if (token === null || chainName === undefined) return false;
  return (
    token?.address[chainName]?.toLowerCase() ===
    getWETHAddress(chainName).toLowerCase()
  );
}
