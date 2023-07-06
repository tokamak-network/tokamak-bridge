import { SupportedChainId } from "@/types/network/supportedNetwork";
import {
  MAINNET_CONTRACTS,
  GOERLI_CONTRACTS,
  TOKAMAK_CONTRACTS,
  TOKAMAK_GOERLI_CONTRACTS,
} from "@/contracts/index";

export default function useGetIncreaseLiquidity(): {
  liquidityInfo: any;
} {
  const data = {
    token0: {
      tokenName: "ETH",
      tokenSymbol: "ETH",
      address: {
        MAINNET: MAINNET_CONTRACTS.WETH_ADDRESS,
        GOERLI: GOERLI_CONTRACTS.WETH_ADDRESS,
        TITAN: TOKAMAK_CONTRACTS.OVM_ETH,
        DARIUS: TOKAMAK_GOERLI_CONTRACTS.OVM_ETH,
      },
      decimals: 18,
      isNativeCurrency: [
        SupportedChainId.MAINNET,
        SupportedChainId.GOERLI,
        SupportedChainId.TITAN,
      ],
      availableForBirdge: true,
    },
    token1: {
      tokenName: "Wrapped TON",
      tokenSymbol: "WTON",
      address: {
        MAINNET: MAINNET_CONTRACTS.WTON_ADDRESS,
        GOERLI: GOERLI_CONTRACTS.WTON_ADDRESS,
        TITAN: null,
        DARIUS: null,
      },
      decimals: 27,
      isNativeCurrency: null,
    },
    token0Amount: '0.1403',
    token1Amount:'2001403',
    fee: 3000,
    inRange: true,
  };

  return { liquidityInfo: data };
}
