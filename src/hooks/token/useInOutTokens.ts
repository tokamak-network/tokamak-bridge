import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { useRecoilValue } from "recoil";
import { Token, Ether } from "@uniswap/sdk-core";
import useConnectedNetwork from "../network";
import { SupportedChainId } from "@/types/network/supportedNetwork";

export function useInOutTokens() {
  const inTokenRecoilValue = useRecoilValue(selectedInTokenStatus);
  const outTokenRecoilValue = useRecoilValue(selectedOutTokenStatus);
  const { connectedChainId, chainName } = useConnectedNetwork();

  const isETH = inTokenRecoilValue?.isNativeCurrency?.includes(
    SupportedChainId.MAINNET || SupportedChainId.GOERLI
  );

  const inToken =
    inTokenRecoilValue && connectedChainId && chainName
      ? {
          ...inTokenRecoilValue,
          token: new Token(
            connectedChainId,
            inTokenRecoilValue.address[chainName] as string,
            inTokenRecoilValue.decimals,
            inTokenRecoilValue.tokenName as string,
            inTokenRecoilValue.tokenName as string
          ),
        }
      : null;

  const outToken =
    outTokenRecoilValue && connectedChainId && chainName
      ? {
          ...outTokenRecoilValue,
          token: new Token(
            connectedChainId,
            outTokenRecoilValue.address[chainName] as string,
            outTokenRecoilValue.decimals,
            outTokenRecoilValue.tokenName as string,
            outTokenRecoilValue.tokenName as string
          ),
        }
      : null;

  return { inToken, outToken };
}
