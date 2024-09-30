import { supportedTokens } from "@/types/token/supportedToken";
import useConnectedNetwork, { useInOutNetwork } from "../network";
import { useInOutTokens } from "../token/useInOutTokens";
import { useGetMode } from "../mode/useGetMode";
import { useSmartRouter } from "../uniswap/useSmartRouter";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { isThanosChain } from "@/utils/network/checkNetwork";

export default function useBridgeSupport() {
  const { inToken } = useInOutTokens();
  const { outNetwork } = useInOutNetwork();
  const { mode } = useGetMode();
  const { routeNotFounded } = useSmartRouter();

  const isOnBridge = mode === "Deposit" || mode === "Withdraw";
  const isSupported = isThanosChain(outNetwork?.chainId)
    ? inToken?.availableForThanosBridge ?? false
    : inToken === null
    ? true
    : inToken?.availableForBirdge ?? false;
  return {
    isNotSupportForBridge: isOnBridge ? !isSupported : false,
    isNotSupportForSwap: routeNotFounded,
  };
}
