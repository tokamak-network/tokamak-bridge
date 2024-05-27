import {
  MAINNET_CONTRACTS,
  SEPOLIA_CONTRACTS,
  THANOS_SEPOLIA_CONTRACTS,
  TOKAMAK_CONTRACTS,
  TITAN_SEPOLIA_CONTRACTS,
} from "@/constant/contracts";
import { SupportedChainId } from "@/types/network/supportedNetwork";

export function getUSDTAddressByChainId(chainId: number) {
  const usdtAddress: Record<number, string> = {
    [SupportedChainId.MAINNET]: MAINNET_CONTRACTS.USDT_ADDRESS,
    [SupportedChainId.TITAN]: TOKAMAK_CONTRACTS.USDT_ADDRESS,
    [SupportedChainId.SEPOLIA]: SEPOLIA_CONTRACTS.USDT_ADDRESS,
    [SupportedChainId.TITAN_SEPOLIA]: TITAN_SEPOLIA_CONTRACTS.USDT_ADDRESS,
    [SupportedChainId.THANOS_SEPOLIA]: THANOS_SEPOLIA_CONTRACTS.USDT_ADDRESS,
  };

  return usdtAddress[chainId];
}

export function isUSDT(tokenAddress: string, chainId: number) {
  const usdtAddress = getUSDTAddressByChainId(chainId);
  return tokenAddress === usdtAddress;
}
