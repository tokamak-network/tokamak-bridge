import { SupportedChainId } from "@/types/network/supportedNetwork";
import { TokenInfo } from "@/types/token/supportedToken";

export function isETH(token: TokenInfo | null) {
  return token?.isNativeCurrency?.includes(
    SupportedChainId.MAINNET ||
      SupportedChainId.GOERLI ||
      SupportedChainId.TITAN ||
      SupportedChainId.DARIUS
  );
}
