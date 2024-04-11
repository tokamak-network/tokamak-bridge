import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import useConnectedNetwork from "../network";
import { useInOutTokens } from "../token/useInOutTokens";
import useIsLoading from "../ui/useIsLoading";
import { useAccount } from "wagmi";
import { useRecoilValue } from "recoil";
import { uniswapTxSetting } from "@/recoil/uniswap/setting";
import { WETH_ADDRESS_BY_CHAINID } from "@/constant/contracts/tokens";
import { isETH } from "@/utils/token/isETH";
import { useGetMode } from "../mode/useGetMode";
import { useDebounce } from "../network/useDebounce";

const getPath = async (queryParmam: string | undefined | null) => {
  try {
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
  } catch (e: any) {
    console.log("**getPath error**");
    console.error(e);
    throw new Error(e);
  }
};

export function useSmartRouter() {
  const { inToken, outToken } = useInOutTokens();
  const { address } = useAccount();
  const txSettingValue = useRecoilValue(uniswapTxSetting);
  const { layer, isConnectedToMainNetwork, connectedChainId } =
    useConnectedNetwork();
  const { mode } = useGetMode();

  const queryParam = useMemo(() => {
    if (
      connectedChainId &&
      inToken &&
      inToken.amountBN !== null &&
      outToken &&
      address &&
      txSettingValue.slippage !== "" &&
      txSettingValue.deadline !== undefined &&
      mode === "Swap"
    ) {
      const isEther = isETH(inToken);
      const isOutEther = isETH(outToken);

      const WETHAddress = WETH_ADDRESS_BY_CHAINID[connectedChainId];

      if ((isEther || isOutEther) && !WETHAddress) return undefined;

      const param = `${
        process.env.NEXT_PUBLIC_ROUTING_API
      }/quote?tokenInAddress=${
        isEther ? WETHAddress : inToken.tokenAddress
      }&tokenInChainId=${connectedChainId}&tokenOutAddress=${
        isOutEther ? WETHAddress : outToken.tokenAddress
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
    mode,
  ]);

  const [, setIsLoading] = useIsLoading();

  const debouncedQueryParam = useDebounce(queryParam, 1000);

  const { isLoading, error, data } = useQuery({
    queryKey: [debouncedQueryParam],
    queryFn: () => getPath(queryParam),
    refetchInterval: 99999999,
    cacheTime: 10000,
  });

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  const routeNotFounded = useMemo(() => {
    if (error) {
      return true;
    }
    return false;
  }, [error]);

  return { routingPath: data, routeNotFounded };
}
