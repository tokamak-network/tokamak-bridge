import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import useConnectedNetwork from "../network";
import { useInOutTokens } from "../token/useInOutTokens";
import useIsLoading from "../ui/useIsLoading";
import { useAccount } from "wagmi";
import { useRecoilValue } from "recoil";
import { uniswapTxSetting } from "@/recoil/uniswap/setting";
import {
  TOKAMAK_CONTRACTS,
  TOKAMAK_GOERLI_CONTRACTS,
} from "@/constant/contracts";
import { isETH } from "@/utils/token/isETH";

const getPath = async (queryParmam: string | undefined | null) => {
  if (queryParmam === undefined || queryParmam === null) {
    return null;
  }
  const res = await fetch(queryParmam, {
    method: "GET",
  });

  if (res.status !== 200) {
    throw new Error("no route founded");
  }

  if (res.ok) {
    return res.json();
  }

  return undefined;
};

export function useSmartRouter() {
  const { connectedChainId } = useConnectedNetwork();
  const { inToken, outToken } = useInOutTokens();
  const [routeNotFounded, setRouteNotFounded] = useState<boolean>(false);
  const { address } = useAccount();
  const txSettingValue = useRecoilValue(uniswapTxSetting);
  const { layer, isConnectedToMainNetwork } = useConnectedNetwork();

  const queryParam = useMemo(() => {
    if (
      connectedChainId &&
      inToken &&
      inToken.amountBN !== null &&
      outToken &&
      address &&
      txSettingValue.slippage !== "" &&
      txSettingValue.deadline !== undefined
    ) {
      const isEther = isETH(inToken);
      const inTokenWETHAddress =
        layer === "L2"
          ? isConnectedToMainNetwork
            ? TOKAMAK_CONTRACTS.WETH_ADDRESS
            : TOKAMAK_GOERLI_CONTRACTS.WETH_ADDRESS
          : inToken.tokenAddress;
      const param = `${
        process.env.NEXT_PUBLIC_ROUTING_API
      }/quote?tokenInAddress=${
        isEther ? inTokenWETHAddress : inToken.tokenAddress
      }&tokenInChainId=${connectedChainId}&tokenOutAddress=${
        outToken.tokenAddress
      }&tokenOutChainId=${connectedChainId}&amount=${
        inToken.amountBN
      }&type=exactIn&slippageTolerance=${txSettingValue.slippage}&deadline=${
        txSettingValue.deadline * 60
      }&recipient=${address}`;
      return param;
    }
    return undefined;
  }, [
    connectedChainId,
    inToken,
    inToken?.amountBN,
    outToken,
    address,
    txSettingValue,
    layer,
    isConnectedToMainNetwork,
  ]);

  const [, setIsLoading] = useIsLoading();

  const { isLoading, error, data, isError, isLoadingError } = useQuery({
    queryKey: [queryParam],
    queryFn: () => getPath(queryParam),
    refetchInterval: 20000,
    // refetchOnMount: false,
  });

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      return setRouteNotFounded(true);
    }
    setRouteNotFounded(false);
  }, [error]);

  return { routingPath: data, routeNotFounded };
}
