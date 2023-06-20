import { useCallback, useEffect } from "react";
import SwapperV2ABI from "@/abis/SwapperV2.json";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useInOutTokens } from "../token/useInOutTokens";
import useContract from "../contracts/useContract";
import { useRecoilState } from "recoil";
import { transactionModalStatus } from "@/recoil/modal/atom";

export default function useWrap() {
  const { SWAPPER_V2_CONTRACT } = useContract();
  const [, setModalOpen] = useRecoilState(transactionModalStatus);

  const { inToken } = useInOutTokens();
  const { data, write: tonWton } = useContractWrite({
    address: SWAPPER_V2_CONTRACT as `0x${string}`,
    abi: SwapperV2ABI.abi,
    functionName: "tonToWton",
  });
  const {
    isLoading: tonWtonLoading,
    isSuccess: tonWtonSuccess,
    isError: tonWrapError,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { write: wtonTon } = useContractWrite({
    address: SWAPPER_V2_CONTRACT as `0x${string}`,
    abi: SwapperV2ABI.abi,
    functionName: "wtonToTon",
  });

  const {
    isLoading: wtonTonLoading,
    isSuccess: wtonTonSuccess,
    isError: WtonUnwrapError,
  } = useWaitForTransaction({
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

  useEffect(() => {
    if (tonWtonLoading || wtonTonLoading) {
      return setModalOpen("confirming");
    }
    if (tonWtonSuccess || wtonTonSuccess) {
      return setModalOpen("confirmed");
    }
    if (tonWrapError || WtonUnwrapError) {
      return setModalOpen("error");
    }
  }, [
    tonWtonLoading,
    wtonTonLoading,
    tonWtonSuccess,
    wtonTonSuccess,
    tonWrapError,
    WtonUnwrapError,
  ]);

  return { wrapTON, unwrapWTON };
}
