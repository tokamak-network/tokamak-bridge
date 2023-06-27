import { useCallback, useEffect } from "react";
import SwapperV2ABI from "@/abis/SwapperV2.json";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useInOutTokens } from "../token/useInOutTokens";
import useContract from "../contracts/useContract";
import { useTx } from "../tx/useTx";
// import { useRecoilState } from "recoil";
// import { transactionModalStatus } from "@/recoil/modal/atom";

export default function useWrap() {
  const { SWAPPER_V2_CONTRACT } = useContract();
  // const [, setModalOpen] = useRecoilState(transactionModalStatus);

  const { inToken } = useInOutTokens();
  const { data, write: tonWton } = useContractWrite({
    address: SWAPPER_V2_CONTRACT as `0x${string}`,
    abi: SwapperV2ABI.abi,
    functionName: "tonToWton",
  });

  const { data: unswrapData, write: wtonTon } = useContractWrite({
    address: SWAPPER_V2_CONTRACT as `0x${string}`,
    abi: SwapperV2ABI.abi,
    functionName: "wtonToTon",
  });

  const {} = useTx({
    hash: data?.hash,
    txSort: "Wrap",
    tokenAddress: inToken?.tokenAddress as `0x${string}`,
  });
  const {} = useTx({
    hash: unswrapData?.hash,
    txSort: "Unwrap",
    tokenAddress: inToken?.tokenAddress as `0x${string}`,
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
