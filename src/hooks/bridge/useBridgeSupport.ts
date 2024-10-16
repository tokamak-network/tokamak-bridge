import { supportedTokens } from "@/types/token/supportedToken";
import useConnectedNetwork from "../network";
import { useInOutTokens } from "../token/useInOutTokens";
import { useGetMode } from "../mode/useGetMode";
import { useSmartRouter } from "../uniswap/useSmartRouter";

export default function useBridgeSupport() {
  const { inToken } = useInOutTokens();
  const { mode } = useGetMode();
  const { routeNotFounded } = useSmartRouter();

  const isOnBridge = mode === "Deposit" || mode === "Withdraw";
  const isSupported =
    inToken === null ? true : inToken?.availableForBirdge ?? false;

  return {
    isNotSupportForBridge: isOnBridge ? !isSupported : false,
    isNotSupportForSwap: routeNotFounded,
  };
}
