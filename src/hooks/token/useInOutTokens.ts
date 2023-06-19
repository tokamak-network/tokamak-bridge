import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { Token, Ether } from "@uniswap/sdk-core";
import useConnectedNetwork from "../network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { useEffect, useMemo, useState } from "react";

export function useInOutTokens() {
  const [inTokenRecoilValue, setInTokenRecoilValue] = useRecoilState(
    selectedInTokenStatus
  );
  const [outTokenRecoilValue, setOutTokenRecoilValue] = useRecoilState(
    selectedOutTokenStatus
  );
  const { connectedChainId, chainName } = useConnectedNetwork();

  const isETH = inTokenRecoilValue?.isNativeCurrency?.includes(
    SupportedChainId.MAINNET || SupportedChainId.GOERLI
  );
  const [chainId, setChainId] = useState<number | undefined>(undefined);

  const inToken = useMemo(() => {
    return inTokenRecoilValue && connectedChainId && chainName
      ? {
          ...inTokenRecoilValue,
          token: new Token(
            connectedChainId,
            inTokenRecoilValue.address[chainName] as string,
            inTokenRecoilValue.decimals,
            inTokenRecoilValue.tokenName as string,
            inTokenRecoilValue.tokenSymbol as string
          ),
        }
      : null;
  }, [inTokenRecoilValue, connectedChainId, chainName]);

  const outToken = useMemo(() => {
    return outTokenRecoilValue && connectedChainId && chainName
      ? {
          ...outTokenRecoilValue,
          token: new Token(
            connectedChainId,
            outTokenRecoilValue.address[chainName] as string,
            outTokenRecoilValue.decimals,
            outTokenRecoilValue.tokenName as string,
            outTokenRecoilValue.tokenSymbol as string
          ),
        }
      : null;
  }, [outTokenRecoilValue, connectedChainId, chainName]);

  useEffect(() => {
    if (connectedChainId) {
      if (connectedChainId !== chainId) {
        setInTokenRecoilValue(null);
        setOutTokenRecoilValue(null);
        return setChainId(connectedChainId);
      }
    }
    return setChainId(undefined);
  }, [connectedChainId]);

  return {
    inToken,
    outToken,
    inTokenInfo: inTokenRecoilValue,
    outTokenInfo: outTokenRecoilValue,
  };
}
