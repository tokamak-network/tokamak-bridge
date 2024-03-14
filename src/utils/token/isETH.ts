import {
  GOERLI_CONTRACTS,
  MAINNET_CONTRACTS,
  TOKAMAK_CONTRACTS,
  TOKAMAK_GOERLI_CONTRACTS,
} from "@/constant/contracts";
import {
  SupportedChainId,
  SupportedChainProperties,
} from "@/types/network/supportedNetwork";
import { TokenInfo } from "@/types/token/supportedToken";

export function isETH(token: TokenInfo | null) {
  if (token === null) return false;
  return token?.isNativeCurrency?.includes(SupportedChainId.MAINNET);
}

export function getWETHAddress(
  chainName: SupportedChainProperties["chainName"]
) {
  const wethAddress: { [K in SupportedChainProperties["chainName"]]: string } =
    {
      MAINNET: MAINNET_CONTRACTS.WETH_ADDRESS,
      TITAN: TOKAMAK_CONTRACTS.WETH_ADDRESS,
    };

  return wethAddress[chainName];
}
