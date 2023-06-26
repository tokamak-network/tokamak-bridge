import { supportedTokens } from "@/types/token/supportedToken";
import useConnectedNetwork from "../network";
import { useInOutTokens } from "../token/useInOutTokens";
import { useGetMode } from "../mode/useGetMode";
import { useAmountOut } from "../swap/useSwapTokens";

export default function useBridgeSupport() {
  const { inToken } = useInOutTokens();
  const { chainName } = useConnectedNetwork();
  const { mode } = useGetMode();
  const { amountOutErr } = useAmountOut();

  const isOnBridge = mode === "Deposit" || mode === "Withdraw";
  const isSupported =
    inToken === null ? true : inToken?.availableForBirdge ?? false;

  return {
    isNotSupportForBridge: isOnBridge ? !isSupported : false,
    isNotSupportForSwap: amountOutErr,
  };
}
