import { useCallback } from "react";
import SwapperV2ABI from "@/abis/SwapperV2.json";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useInOutTokens } from "../token/useInOutTokens";
import useContract from "../contracts/useContract";

export default function useWrap() {
  const { SWAPPER_V2_CONTRACT } = useContract();

  const { inToken } = useInOutTokens();
  const { data, write: tonWton } = useContractWrite({
    address: SWAPPER_V2_CONTRACT as `0x${string}`,
    abi: SwapperV2ABI.abi,
    functionName: "tonToWton",
  });
  const { isLoading: tonWtonLoading, isSuccess: tonWtonSuccess } =
    useWaitForTransaction({
      hash: data?.hash,
    });

  const { write: wtonTon } = useContractWrite({
    address: SWAPPER_V2_CONTRACT as `0x${string}`,
    abi: SwapperV2ABI.abi,
    functionName: "wtonToTon",
  });

  const { isLoading: wtonTonLoading, isSuccess: wtonTonSuccess } =
    useWaitForTransaction({
      hash: data?.hash,
    });

  const wrapTON = useCallback(() => {
    try {
      if (inToken && inToken.amountBN) {
        tonWton({
          args: [inToken.amountBN],
        });
      }
    } catch (e) {
      console.log("**wrapTON err**");
      console.log(e);
    }
  }, [inToken]);

  const unwrapWTON = useCallback(() => {
    try {
      if (inToken && inToken.amountBN) {
        wtonTon({
          args: [inToken.amountBN],
        });
      }
    } catch (e) {
      console.log("**unwrapWTON err**");
      console.log(e);
    }
  }, [inToken]);

  return { wrapTON, unwrapWTON };
}
