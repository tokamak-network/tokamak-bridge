import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { useRecoilValue } from "recoil";
import { Token } from "@uniswap/sdk-core";
import useConnectedNetwork from "../network";

export function useInOutTokens() {
  const inTokenRecoilValue = useRecoilValue(selectedInTokenStatus);
  const outTokenRecoilValue = useRecoilValue(selectedOutTokenStatus);
  const { connectedChainId } = useConnectedNetwork();

  const inToken =
    inTokenRecoilValue && connectedChainId
      ? {
          ...inTokenRecoilValue,
          token: new Token(
            connectedChainId,
            inTokenRecoilValue.address["DARIUS"] as string,
            inTokenRecoilValue.decimals,
            inTokenRecoilValue.tokenName as string,
            inTokenRecoilValue.tokenName as string
          ),
        }
      : null;

  const outToken =
    outTokenRecoilValue && connectedChainId
      ? {
          ...outTokenRecoilValue,
          token: new Token(
            connectedChainId,
            outTokenRecoilValue.address["DARIUS"] as string,
            outTokenRecoilValue.decimals,
            outTokenRecoilValue.tokenName as string,
            outTokenRecoilValue.tokenName as string
          ),
        }
      : null;

  return { inToken, outToken };
}
