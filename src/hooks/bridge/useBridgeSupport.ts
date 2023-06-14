import { supportedTokens } from "@/types/token/supportedToken";
import useConnectedNetwork from "../network";
import { useInOutTokens } from "../token/useInOutTokens";
import { useGetMode } from "../mode/useGetMode";

export default function useBridgeSupport() {
  const { inToken } = useInOutTokens();
  const { chainName } = useConnectedNetwork();
  const { mode } = useGetMode();

  const isOnBridge = mode === "Deposit" || mode === "Withdraw";
  const isSupported =
    chainName &&
    supportedTokens.filter((e) => {
      return e.address[chainName] === inToken?.tokenAddress;
    });

  return {
    isNotSupportForBridge: isOnBridge ? isSupported?.length === 0 : false,
  };
}
