import { WTON } from "./../../utils/uniswap/libs/constant";
import { USDT } from "./../uniswap/tokens";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import {
  MAINNET_CONTRACTS,
  SEPOLIA_CONTRACTS,
  THANOS_SEPOLIA_CONTRACTS,
  TITAN_SEPOLIA_CONTRACTS,
  TOKAMAK_CONTRACTS,
} from ".";
import { SupportedTokenSymbol } from "@/types/token/supportedToken";
import { ZERO_ADDRESS } from "../misc";

export const ETH_ADDRESS_BY_CHAINID: Record<number, string> = {
  [SupportedChainId.MAINNET]: ZERO_ADDRESS,
  [SupportedChainId.SEPOLIA]: ZERO_ADDRESS,
  [SupportedChainId.TITAN]: ZERO_ADDRESS,
  [SupportedChainId.TITAN_SEPOLIA]: ZERO_ADDRESS,
  [SupportedChainId.THANOS_SEPOLIA]: THANOS_SEPOLIA_CONTRACTS.ETH_ADDRESS,
};

export const WETH_ADDRESS_BY_CHAINID: Record<number, string> = {
  [SupportedChainId.MAINNET]: MAINNET_CONTRACTS.WETH_ADDRESS,
  [SupportedChainId.SEPOLIA]: SEPOLIA_CONTRACTS.WETH_ADDRESS,
  [SupportedChainId.TITAN]: TOKAMAK_CONTRACTS.WETH_ADDRESS,
  [SupportedChainId.TITAN_SEPOLIA]: TITAN_SEPOLIA_CONTRACTS.WETH_ADDRESS,
};

export const TON_ADDRESS_BY_CHAINID: Record<number, string> = {
  [SupportedChainId.MAINNET]: MAINNET_CONTRACTS.TON_ADDRESS,
  [SupportedChainId.SEPOLIA]: SEPOLIA_CONTRACTS.TON_ADDRESS,
  [SupportedChainId.TITAN]: TOKAMAK_CONTRACTS.TON_ADDRESS,
  [SupportedChainId.TITAN_SEPOLIA]: TITAN_SEPOLIA_CONTRACTS.TON_ADDRESS,
  [SupportedChainId.THANOS_SEPOLIA]: THANOS_SEPOLIA_CONTRACTS.TON_ADDRESS,
};

export const TOS_ADDRESS_BY_CHAINID: Record<number, string> = {
  [SupportedChainId.MAINNET]: MAINNET_CONTRACTS.TOS_ADDRESS,
  [SupportedChainId.SEPOLIA]: SEPOLIA_CONTRACTS.TOS_ADDRESS,
  [SupportedChainId.TITAN]: TOKAMAK_CONTRACTS.TOS_ADDRESS,
  [SupportedChainId.TITAN_SEPOLIA]: TITAN_SEPOLIA_CONTRACTS.TOS_ADDRESS,
  [SupportedChainId.THANOS_SEPOLIA]: THANOS_SEPOLIA_CONTRACTS.TOS_ADDRESS,
};

export const WTON_ADDRESS_BY_CHAINID: Record<number, string> = {
  [SupportedChainId.MAINNET]: MAINNET_CONTRACTS.WTON_ADDRESS,
  [SupportedChainId.SEPOLIA]: SEPOLIA_CONTRACTS.WTON_ADDRESS,
  [SupportedChainId.THANOS_SEPOLIA]: THANOS_SEPOLIA_CONTRACTS.WTON_ADDRESS,
};

export const USDT_ADDRESS_BY_CHAINID: Record<number, string> = {
  [SupportedChainId.MAINNET]: MAINNET_CONTRACTS.USDT_ADDRESS,
  [SupportedChainId.SEPOLIA]: SEPOLIA_CONTRACTS.USDT_ADDRESS,
  [SupportedChainId.TITAN]: TOKAMAK_CONTRACTS.USDT_ADDRESS,
  [SupportedChainId.TITAN_SEPOLIA]: TITAN_SEPOLIA_CONTRACTS.USDT_ADDRESS,
  [SupportedChainId.THANOS_SEPOLIA]: THANOS_SEPOLIA_CONTRACTS.USDT_ADDRESS,
};

export const USDC_ADDRESS_BY_CHAINID: Record<number, string> = {
  [SupportedChainId.MAINNET]: MAINNET_CONTRACTS.USDC_ADDRESS,
  [SupportedChainId.SEPOLIA]: SEPOLIA_CONTRACTS.USDC_ADDRESS,
  [SupportedChainId.TITAN]: TOKAMAK_CONTRACTS.USDC_ADDRESS,
  [SupportedChainId.TITAN_SEPOLIA]: TITAN_SEPOLIA_CONTRACTS.USDC_ADDRESS,
  [SupportedChainId.THANOS_SEPOLIA]: THANOS_SEPOLIA_CONTRACTS.USDC_ADDRESS,
};

export const getTokenAddressByChainId = (
  symbol: string,
  chainId: SupportedChainId | undefined
) => {
  if (!chainId) return "";
  switch (symbol) {
    case "ETH":
      return ETH_ADDRESS_BY_CHAINID[chainId];
    case "TON":
      return TON_ADDRESS_BY_CHAINID[chainId];
    case "WETH":
      return WETH_ADDRESS_BY_CHAINID[chainId];
    case "WTON":
      return WTON_ADDRESS_BY_CHAINID[chainId];
    case "USDC":
      return USDC_ADDRESS_BY_CHAINID[chainId];
    case "USDT":
      return USDT_ADDRESS_BY_CHAINID[chainId];
    default:
      return "";
  }
};
