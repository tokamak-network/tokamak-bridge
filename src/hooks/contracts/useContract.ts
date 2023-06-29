import useConnectedNetwork from "@/hooks/network";
import {
  MAINNET_CONTRACTS,
  GOERLI_CONTRACTS,
  TOKAMAK_CONTRACTS,
  TOKAMAK_GOERLI_CONTRACTS,
} from "@/constant/contracts";
import { useUniswapContracts } from "@/hooks/uniswap/useUniswapContracts";

export default function useContract() {
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { UNISWAP_CONTRACT } = useUniswapContracts();

  const L1BRIDGE_CONTRACT = isConnectedToMainNetwork
    ? MAINNET_CONTRACTS.L1Bridge
    : GOERLI_CONTRACTS.L1Bridge;
  const L2BRIDGE_CONTRACT = isConnectedToMainNetwork
    ? TOKAMAK_CONTRACTS.L2Bridge
    : TOKAMAK_GOERLI_CONTRACTS.L2Bridge;

  const SWAPPER_V2_CONTRACT = isConnectedToMainNetwork
    ? MAINNET_CONTRACTS.SwapperV2Proxy
    : GOERLI_CONTRACTS.SwapperV2Proxy;
  return {
    UNISWAP_CONTRACT,
    L1BRIDGE_CONTRACT,
    L2BRIDGE_CONTRACT,
    SWAPPER_V2_CONTRACT,
  };
}
