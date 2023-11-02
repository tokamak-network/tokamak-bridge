import {
  inTokenSelector,
  outTokenSelector,
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { Token } from "@uniswap/sdk-core";
import useConnectedNetwork from "../network";
import { useCallback, useEffect, useMemo } from "react";
import { useProvier } from "../provider/useProvider";
import { useGetMode } from "../mode/useGetMode";
import { getWETHAddress, isETH } from "@/utils/token/isETH";

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

  const inToken = useMemo(() => {
    return inTokenRecoilValue && connectedChainId && chainName
      ? inTokenRecoilValue.address[chainName] === null ||
        inTokenRecoilValue.address[chainName] === undefined
        ? null
        : {
            ...inTokenRecoilValue,
            tokenAddress: isETH(inTokenRecoilValue)
              ? getWETHAddress(chainName)
              : (inTokenRecoilValue.address[chainName] as string),
            token: new Token(
              connectedChainId,
              isETH(inTokenRecoilValue)
                ? getWETHAddress(chainName)
                : (inTokenRecoilValue.address[chainName] as string),
              inTokenRecoilValue.decimals,
              inTokenRecoilValue.tokenSymbol as string,
              inTokenRecoilValue.tokenName as string
            ),
          }
      : null;
  }, [inTokenRecoilValue, connectedChainId, chainName]);

  const outToken = useMemo(() => {
    if (mode === "Deposit" || mode === "Withdraw") {
      return null;
    }

    return outTokenRecoilValue && connectedChainId && chainName
      ? outTokenRecoilValue.address[chainName] === null ||
        outTokenRecoilValue.address[chainName] === undefined
        ? null
        : {
            ...outTokenRecoilValue,
            tokenAddress: isETH(outTokenRecoilValue)
              ? getWETHAddress(chainName)
              : (outTokenRecoilValue.address[chainName] as string),
            token: new Token(
              connectedChainId,
              isETH(outTokenRecoilValue)
                ? getWETHAddress(chainName)
                : (outTokenRecoilValue.address[chainName] as string),
              outTokenRecoilValue.decimals,
              outTokenRecoilValue.tokenSymbol as string,
              outTokenRecoilValue.tokenName as string
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
      // console.log(e);
    });
  }, [connectedChainId, provider, inToken?.tokenAddress]);

  const { inTokenHasAmount } = useRecoilValue(inTokenSelector);
  const { outTokenHasAmount } = useRecoilValue(outTokenSelector);

  const tokensPairHasAmount = useMemo(() => {
    return inTokenHasAmount && outTokenHasAmount;
  }, [inTokenHasAmount, outTokenHasAmount]);

  const invertTokenPair = useCallback(() => {
    if (inTokenRecoilValue && outTokenRecoilValue) {
      setInTokenRecoilValue(outTokenRecoilValue);
      return setOutTokenRecoilValue(inTokenRecoilValue);
    }
  }, [inTokenRecoilValue, outTokenRecoilValue]);

  const initializeTokenPair = useCallback(() => {
    setInTokenRecoilValue(null);
    return setOutTokenRecoilValue(null);
  }, [setInTokenRecoilValue, setOutTokenRecoilValue]);

  const initializeTokenPairAmount = useCallback(() => {
    if (inTokenRecoilValue && inTokenRecoilValue !== null) {
      setInTokenRecoilValue({
        ...inTokenRecoilValue,
        amountBN: null,
        parsedAmount: null,
      });
    }

    if (outTokenRecoilValue && outTokenRecoilValue !== null) {
      setOutTokenRecoilValue({
        ...outTokenRecoilValue,
        amountBN: null,
        parsedAmount: null,
      });
    }
  }, [inTokenRecoilValue, outTokenRecoilValue]);

  const initializeInTokenAmount = useCallback(() => {
    if (inTokenRecoilValue && inTokenRecoilValue !== null) {
      return setInTokenRecoilValue({
        ...inTokenRecoilValue,
        amountBN: null,
        parsedAmount: null,
      });
    }
  }, [inTokenRecoilValue, outTokenRecoilValue]);

  const initializeOutTokenAmount = useCallback(() => {
    if (outTokenRecoilValue && outTokenRecoilValue !== null) {
      setOutTokenRecoilValue({
        ...outTokenRecoilValue,
        amountBN: null,
        parsedAmount: null,
      });
    }
  }, [inTokenRecoilValue, outTokenRecoilValue]);

  return {
    inToken,
    outToken,
    inTokenInfo: inTokenRecoilValue,
    outTokenInfo: outTokenRecoilValue,
    inTokenHasAmount,
    outTokenHasAmount,
    tokensPairHasAmount,
    invertTokenPair,
    initializeTokenPair,
    initializeTokenPairAmount,
    initializeInTokenAmount,
    initializeOutTokenAmount,
  };
}
