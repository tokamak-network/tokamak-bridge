import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { Token, Ether } from "@uniswap/sdk-core";
import useConnectedNetwork from "../network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { useEffect, useMemo, useState } from "react";
import { useProvier } from "../provider/useProvider";
import { useGetMode } from "../mode/useGetMode";

export function useInOutTokens() {
  const [inTokenRecoilValue, setInTokenRecoilValue] = useRecoilState(
    selectedInTokenStatus
  );
  const [outTokenRecoilValue, setOutTokenRecoilValue] = useRecoilState(
    selectedOutTokenStatus
  );
  const { connectedChainId, chainName } = useConnectedNetwork();
  const { provider } = useProvier();
  const { mode } = useGetMode();

  const isETH = inTokenRecoilValue?.isNativeCurrency?.includes(
    SupportedChainId.MAINNET || SupportedChainId.GOERLI
  );

  const inToken = useMemo(() => {
    return inTokenRecoilValue && connectedChainId && chainName
      ? inTokenRecoilValue.address[chainName] === null ||
        inTokenRecoilValue.address[chainName] === undefined
        ? null
        : {
            ...inTokenRecoilValue,
            tokenAddress: inTokenRecoilValue.address[chainName],
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
    if (mode === "Deposit" || mode === "Withdraw") {
      return null;
    }
    return outTokenRecoilValue && connectedChainId && chainName
      ? {
          ...outTokenRecoilValue,
          tokenAddress: outTokenRecoilValue.address[chainName],
          token: new Token(
            connectedChainId,
            outTokenRecoilValue.address[chainName] as string,
            outTokenRecoilValue.decimals,
            outTokenRecoilValue.tokenName as string,
            outTokenRecoilValue.tokenSymbol as string
          ),
        }
      : null;
  }, [outTokenRecoilValue, connectedChainId, chainName, mode]);

  //initialize selectedTokens when a network is changed
  // useEffect(() => {
  //   if (connectedChainId) {
  //     if (connectedChainId !== chainId) {
  //       setInTokenRecoilValue(null);
  //       setOutTokenRecoilValue(null);
  //       return setChainId(connectedChainId);
  //     }
  //   }
  //   return setChainId(undefined);
  // }, [connectedChainId]);

  useEffect(() => {
    const thisTokenExist = async () => {
      if (connectedChainId && provider && inToken?.tokenAddress) {
        const code = await provider.getCode(inToken?.tokenAddress);

        //"0x" means this token address doesn't exsit on this chain
        if (code.length <= 2) {
          setInTokenRecoilValue(null);
        }
      }
      if (connectedChainId && provider && outToken?.tokenAddress) {
        const code = await provider.getCode(outToken?.tokenAddress);

        //"0x" means this token address doesn't exsit on this chain
        if (code.length <= 2) {
          setOutTokenRecoilValue(null);
        }
      }
    };
    thisTokenExist().catch((e) => {
      console.log("**thisTokenExist err**");
      console.log(e);
    });
  }, [connectedChainId, provider, inToken?.tokenAddress]);

  return {
    inToken,
    outToken,
    inTokenInfo: inTokenRecoilValue,
    outTokenInfo: outTokenRecoilValue,
  };
}
