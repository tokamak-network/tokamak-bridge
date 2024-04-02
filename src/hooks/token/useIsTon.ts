import { useMemo } from "react";
import { useInOutTokens } from "./useInOutTokens";
import { MAINNET_CONTRACTS, SEPOLIA_CONTRACTS } from "@/constant/contracts";
import useConnectedNetwork from "@/hooks/network";

export default function useIsTon() {
  const { inToken, outToken } = useInOutTokens();
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  const isTONIn = useMemo(() => {
    if (inToken?.tokenAddress) {
      const isTON = inToken.tokenAddress?.includes(
        isConnectedToMainNetwork
          ? MAINNET_CONTRACTS.TON_ADDRESS
          : SEPOLIA_CONTRACTS.TON_ADDRESS
      );
      return isTON;
    }
  }, [inToken?.tokenAddress, isConnectedToMainNetwork]);

  const isTONOut = useMemo(() => {
    if (outToken?.tokenAddress) {
      const isTON = outToken.tokenAddress.includes(
        isConnectedToMainNetwork
          ? MAINNET_CONTRACTS.TON_ADDRESS
          : SEPOLIA_CONTRACTS.TON_ADDRESS
      );
      return isTON;
    }
  }, [outToken?.tokenAddress, isConnectedToMainNetwork]);

  const isTONatPair = (isTONIn || isTONOut) ?? false;

  return { isTONIn, isTONOut, isTONatPair };
}
