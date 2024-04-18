import useConnectedNetwork, { useInOutNetwork } from "@/hooks/network";
import {
  MAINNET_CONTRACTS,
  GOERLI_CONTRACTS,
  TOKAMAK_CONTRACTS,
  TOKAMAK_GOERLI_CONTRACTS,
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

  const SWAPPER_V2_CONTRACT = isConnectedToMainNetwork
    ? MAINNET_CONTRACTS.SwapperV2Proxy
    : SEPOLIA_CONTRACTS.SwapperV2Proxy;

  const L1MESSENGER_CONTRACT = isConnectedToMainNetwork
    ? MAINNET_CONTRACTS.L1Messenger
    : outNetwork?.chainId === SupportedChainId["THANOS_SEPOLIA"]
    ? SEPOLIA_CONTRACTS.L1Messenger
    : SEPOLIA_CONTRACTS.L1Messenger_TITAN_SEPOLIA;

  return {
    UNISWAP_CONTRACT,
    L1BRIDGE_CONTRACT,
    L2BRIDGE_CONTRACT,
    SWAPPER_V2_CONTRACT,
    L1MESSENGER_CONTRACT,
  };
}
