import useConnectedNetwork, { useInOutNetwork } from "@/hooks/network";
import {
  MAINNET_CONTRACTS,
  TOKAMAK_CONTRACTS,
  SEPOLIA_CONTRACTS,
  TITAN_SEPOLIA_CONTRACTS,
  THANOS_SEPOLIA_CONTRACTS,
} from "@/constant/contracts";
import { useUniswapContracts } from "@/hooks/uniswap/useUniswapContracts";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import {
  L1_ETHEREUM_CT,
  L1_SEPOLIA_CT,
  L2_TITAN_CT,
  L2_TITAN_SEPOLIA_CT,
} from "@/constant/contracts/crossTrade";
import { useInOutTokens } from "../token/useInOutTokens";

export default function useContract() {
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { UNISWAP_CONTRACT } = useUniswapContracts();
  const { outNetwork } = useInOutNetwork();
  const { outToken } = useInOutTokens();

  const L1BRIDGE_CONTRACT = isConnectedToMainNetwork
    ? MAINNET_CONTRACTS.L1Bridge
    : outNetwork?.chainId !== SupportedChainId["THANOS_SEPOLIA"]
    ? SEPOLIA_CONTRACTS.L1Bridge_TITAN_SEPOLIA
    : outToken?.tokenSymbol === "USDC"
    ? SEPOLIA_CONTRACTS.L1USDCBridge_THANOS_SEPOLIA
    : SEPOLIA_CONTRACTS.L1Bridge_THANOS_SEPOLIA;
  const L2BRIDGE_CONTRACT = isConnectedToMainNetwork
    ? TOKAMAK_CONTRACTS.L2Bridge
    : outNetwork?.chainId === SupportedChainId["THANOS_SEPOLIA"]
    ? THANOS_SEPOLIA_CONTRACTS.L2Bridge
    : TITAN_SEPOLIA_CONTRACTS.L2Bridge;

  const WTON_CONTRACT = isConnectedToMainNetwork
    ? MAINNET_CONTRACTS.WTON_ADDRESS
    : SEPOLIA_CONTRACTS.WTON_ADDRESS;

  const L1MESSENGER_CONTRACT = isConnectedToMainNetwork
    ? MAINNET_CONTRACTS.L1Messenger
    : outNetwork?.chainId === SupportedChainId["THANOS_SEPOLIA"]
    ? SEPOLIA_CONTRACTS.L1Messenger_THANOS_SEPOLIA
    : SEPOLIA_CONTRACTS.L1Messenger_TITAN_SEPOLIA;

  const L1CrossTrade_CONTRACT = isConnectedToMainNetwork
    ? L1_ETHEREUM_CT
    : L1_SEPOLIA_CT;
  const L2CrossTrade_CONTRACT = isConnectedToMainNetwork
    ? L2_TITAN_CT
    : L2_TITAN_SEPOLIA_CT;

  return {
    UNISWAP_CONTRACT,
    L1BRIDGE_CONTRACT,
    L2BRIDGE_CONTRACT,
    WTON_CONTRACT,
    L1MESSENGER_CONTRACT,
    L1CrossTrade_CONTRACT,
    L2CrossTrade_CONTRACT,
  };
}
