import useConnectedNetwork from "@/hooks/network";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { supportedTokensForCt } from "@/types/token/supportedToken";
import { isETH } from "@/utils/token/isETH";
import { useMemo } from "react";

export function useWhiteListToken() {
  const { inToken } = useInOutTokens();
  const { connectedChainId } = useConnectedNetwork();

  const isWhiteListToken = useMemo(() => {
    if (inToken && connectedChainId) {
      const thisTokenIsETH = isETH(inToken);
      const tokensForThisNetwork = supportedTokensForCt[connectedChainId];
      const isWhiteListToken = Object.values(tokensForThisNetwork).some(
        (token) =>
          token.address.toLowerCase() === inToken.tokenAddress.toLowerCase(),
      );
      return isWhiteListToken || thisTokenIsETH;
    }
  }, [inToken?.tokenAddress, connectedChainId]);

  return { isWhiteListToken };
}
