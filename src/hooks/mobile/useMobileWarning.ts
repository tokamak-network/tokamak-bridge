import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import { useGetMode } from "@/hooks/mode/useGetMode";
import useIsTon from "@/hooks/token/useIsTon";
import useConnectedNetwork from "@/hooks/network";
import {
  MAINNET_CONTRACTS,
  SEPOLIA_CONTRACTS,
  TOKAMAK_CONTRACTS,
} from "@/constant/contracts";

export function useWarning() {
  const { isNotSupportForBridge, isNotSupportForSwap } = useBridgeSupport();
  const { inToken, outToken } = useInOutTokens();
  const { isBalanceOver } = useInputBalanceCheck();
  const { mode } = useGetMode();
  const { isTONatPair } = useIsTon();
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  if (mode === "Swap" && inToken && outToken && isTONatPair) {
    if (
      outToken.tokenAddress === MAINNET_CONTRACTS.TON_ADDRESS ||
      outToken.tokenAddress === SEPOLIA_CONTRACTS.TON_ADDRESS
    ) {
      return {
        message: "TON is not supported to swap on L1. Please swap to WTON.",
        type: "warning",
      };
    }
    return {
      message: "TON is not supported to swap on L1. Please wrap to WTON.",
      type: "warning",
    };
  }

  if (isNotSupportForBridge) {
    if (inToken?.tokenAddress === MAINNET_CONTRACTS.WETH_ADDRESS) {
      return {
        message: `Cannot deposit WETH to ${
          isConnectedToMainNetwork ? "Titan" : "Titan Goerli"
        }. Unwrap to ETH and deposit.`,
        type: "warning",
      };
    }
    if (inToken?.tokenAddress === MAINNET_CONTRACTS.WTON_ADDRESS) {
      return {
        message:
          "WTON is not supported on L2. Please unwrap to TON and deposit",
        type: "warning",
      };
    }
    if (inToken?.tokenAddress === TOKAMAK_CONTRACTS.WETH_ADDRESS) {
      return {
        message: `Cannot withdraw WETH to ${
          isConnectedToMainNetwork ? "Ethereum" : "Goerli"
        }. Unwrap to ETH and withdraw.`,
        type: "warning",
      };
    }
  }

  if (mode === "Swap" && isNotSupportForSwap) {
    return { message: "Swap route not found on this network", type: "error" };
  }

  if (isBalanceOver) {
    return {
      message: `Insufficient ${inToken?.tokenSymbol} balance`,
      type: "error",
    };
  }

  return null;
}
