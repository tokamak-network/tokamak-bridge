// import { useQuery } from "@tanstack/react-query";
// import { useCallback } from "react";
// import useConnectedNetwork from "../network";
// import { useInOutTokens } from "../token/useInOutTokens";

// const getPath = async () => {
//   const res = await fetch(L2param);

//   //@ts-ignore
//   return res.data;
// };

// export function useSmartRouter() {
//   const { connectedChainId } = useConnectedNetwork();
//   const { inToken, outToken } = useInOutTokens();
//   //   const getPath = useCallback(async () => {
//   //     if (connectedChainId && inToken && outToken) {
//   //       const param = `${process.env.NEXT_PUBLIC_ROUTING_API}/prod/quote?tokenInAddress=${inToken.tokenAddress}&tokenInChainId=${connectedChainId}&tokenOutAddress=${outToken.tokenAddress}&tokenOutChainId=${connectedChainId}&amount=${inToken.parsedAmount}&type=exactIn`;
//   //       const res = await fetch(param);
//   //       //@ts-ignore
//   //       return res.data;
//   //     }
//   //   }, [connectedChainId, inToken, outToken]);

//   const { isLoading, error, data } = useQuery({
//     queryKey: ["paths"],
//     queryFn: () => getPath(),
//     refetchInterval: 9999999,
//   });

//   console.log(data, error);
// }
