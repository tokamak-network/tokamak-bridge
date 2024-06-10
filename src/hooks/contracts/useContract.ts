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

export default function useContract() {
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { UNISWAP_CONTRACT } = useUniswapContracts();
  const { outNetwork } = useInOutNetwork();

  const L1BRIDGE_CONTRACT = isConnectedToMainNetwork
    ? MAINNET_CONTRACTS.L1Bridge
    : outNetwork?.chainId === SupportedChainId["THANOS_SEPOLIA"]
    ? SEPOLIA_CONTRACTS.L1Bridge
    : SEPOLIA_CONTRACTS.L1Bridge_TITAN_SEPOLIA;
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
    ? SEPOLIA_CONTRACTS.L1Messenger
    : SEPOLIA_CONTRACTS.L1Messenger_TITAN_SEPOLIA;

  return {
    UNISWAP_CONTRACT,
    L1BRIDGE_CONTRACT,
    L2BRIDGE_CONTRACT,
    WTON_CONTRACT,
    L1MESSENGER_CONTRACT,
  };
}
