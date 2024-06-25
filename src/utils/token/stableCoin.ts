import {
  MAINNET_CONTRACTS,
  SEPOLIA_CONTRACTS,
  THANOS_SEPOLIA_CONTRACTS,
  TOKAMAK_CONTRACTS,
  TITAN_SEPOLIA_CONTRACTS,
} from "@/constant/contracts";
import {
  USDC_ADDRESS_BY_CHAINID,
  USDT_ADDRESS_BY_CHAINID,
} from "@/constant/contracts/tokens";
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

export const isStableCoin = (tokenAddress: string) => {
  const isUSDT = Object.values(USDT_ADDRESS_BY_CHAINID).some(
    (tokenAddress) => tokenAddress !== undefined
  );
  const isUSDC = Object.values(USDC_ADDRESS_BY_CHAINID).some(
    (tokenAddress) => tokenAddress !== undefined
  );
  return isUSDT || isUSDC;
};
