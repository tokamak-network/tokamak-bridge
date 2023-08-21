import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { useRecoilState } from "recoil";
import useConnectedNetwork from "../network";
import { useEffect, useMemo, useState } from "react";
import { useProvier } from "../provider/useProvider";
import { useGetMode } from "../mode/useGetMode";
import { useAccount } from "wagmi";

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
  const { isConnected } = useAccount();

  const inToken = useMemo(() => {
    return inTokenRecoilValue && chainName
      ? inTokenRecoilValue.address[chainName] === null ||
        inTokenRecoilValue.address[chainName] === undefined
        ? null
        : {
            ...inTokenRecoilValue,
            tokenAddress: inTokenRecoilValue.address[chainName],
          }
      : null;
  }, [inTokenRecoilValue, connectedChainId, chainName]);

  const outToken = useMemo(() => {
    if (mode === "Deposit" || mode === "Withdraw") {
      return null;
    }
    return outTokenRecoilValue && chainName
      ? outTokenRecoilValue.address[chainName] === null ||
        outTokenRecoilValue.address[chainName] === undefined
        ? null
        : {
            ...outTokenRecoilValue,
            tokenAddress: outTokenRecoilValue.address[chainName],
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
      if (isConnected === false) {
        return;
      }
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
  }, [connectedChainId, provider, inToken?.tokenAddress, isConnected]);

  return {
    inToken,
    outToken,
    inTokenInfo: inTokenRecoilValue,
    outTokenInfo: outTokenRecoilValue,
  };
}
