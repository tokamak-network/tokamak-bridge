import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import useConnectedNetwork from "../network";
import { useInOutTokens } from "../token/useInOutTokens";

const L2param =
  "https://il8cekrooh.execute-api.ap-northeast-2.amazonaws.com/prod/quote?tokenInAddress=0xFa956eB0c4b3E692aD5a6B2f08170aDE55999ACa&tokenInChainId=5050&tokenOutAddress=0x6AF3cb766D6cd37449bfD321D961A61B0515c1BC&tokenOutChainId=5050&amount=1000000000000000000000&type=exactIn";

const l1GOERLI =
  "https://il8cekrooh.execute-api.ap-northeast-2.amazonaws.com/prod/quote?tokenInAddress=0xe86fCf5213C785AcF9a8BFfEeDEfA9a2199f7Da6&tokenInChainId=5&tokenOutAddress=0x67F3bE272b1913602B191B3A68F7C238A2D81Bb9&tokenOutChainId=5&amount=1000000000000000000000&type=exactIn";

const getPath = async () => {
  const res = await fetch(L2param);

  //@ts-ignore
  return res.data;
};

export function useSmartRouter() {
  const { connectedChainId } = useConnectedNetwork();
  const { inToken, outToken } = useInOutTokens();
  //   const getPath = useCallback(async () => {
  //     if (connectedChainId && inToken && outToken) {
  //       const param = `${process.env.NEXT_PUBLIC_ROUTING_API}/prod/quote?tokenInAddress=${inToken.tokenAddress}&tokenInChainId=${connectedChainId}&tokenOutAddress=${outToken.tokenAddress}&tokenOutChainId=${connectedChainId}&amount=${inToken.parsedAmount}&type=exactIn`;
  //       const res = await fetch(param);
  //       //@ts-ignore
  //       return res.data;
  //     }
  //   }, [connectedChainId, inToken, outToken]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["paths"],
    queryFn: () => getPath(),
    refetchInterval: 9999999,
  });

  console.log(data, error);
}
