import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import useConnectedNetwork from "../network";
import { useInOutTokens } from "../token/useInOutTokens";
import useIsLoading from "../ui/useIsLoading";
import { truncate } from "fs/promises";

const L2param =
  "https://il8cekrooh.execute-api.ap-northeast-2.amazonaws.com/prod/quote?tokenInAddress=0x6AF3cb766D6cd37449bfD321D961A61B0515c1BC&tokenInChainId=5050&tokenOutAddress=0xFa956eB0c4b3E692aD5a6B2f08170aDE55999ACa&tokenOutChainId=5050&amount=10000000000000000000&type=exactIn&slippageTolerance=20&deadline=1200&recipient=0x8c595DA827F4182bC0E3917BccA8e654DF8223E1";

const l1GOERLI =
  "https://il8cekrooh.execute-api.ap-northeast-2.amazonaws.com/prod/quote?tokenInAddress=0x67f3be272b1913602b191b3a68f7c238a2d81bb9&tokenInChainId=5&tokenOutAddress=0xe86fCf5213C785AcF9a8BFfEeDEfA9a2199f7Da6&tokenOutChainId=5&amount=1000000000000000000000000&type=exactIn&slippageTolerance=20&deadline=1200&recipient=0x8c595DA827F4182bC0E3917BccA8e654DF8223E1";

const l1MAINNET =
  "https://il8cekrooh.execute-api.ap-northeast-2.amazonaws.com/prod/quote?tokenInAddress=0xc4A11aaf6ea915Ed7Ac194161d2fC9384F15bff2&tokenInChainId=1&tokenOutAddress=0x409c4D8cd5d2924b9bc5509230d16a61289c8153&tokenOutChainId=1&amount=10000000000000000000000000000000&type=exactIn&slippageTolerance=20&deadline=1200&recipient=0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad";

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

  const queryParam = useMemo(() => {
    if (connectedChainId && inToken && inToken.amountBN !== null && outToken) {
      const param = `${process.env.NEXT_PUBLIC_ROUTING_API}/quote?tokenInAddress=${inToken.tokenAddress}&tokenInChainId=${connectedChainId}&tokenOutAddress=${outToken.tokenAddress}&tokenOutChainId=${connectedChainId}&amount=${inToken.amountBN}&type=exactIn&slippageTolerance=20&deadline=1200&recipient=0x8c595DA827F4182bC0E3917BccA8e654DF8223E1`;
      return param;
    }
    return undefined;
  }, [connectedChainId, inToken, inToken?.amountBN, outToken]);

  const [, setIsLoading] = useIsLoading();

  const { isLoading, error, data, isError, isLoadingError } = useQuery({
    queryKey: [queryParam],
    queryFn: () => getPath(queryParam),
    refetchInterval: 99999999,
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
