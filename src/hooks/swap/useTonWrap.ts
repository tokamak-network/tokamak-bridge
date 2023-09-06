import { useCallback, useEffect } from "react";
import SwapperV2ABI from "@/abis/SwapperV2.json";
import WethABi from "@/abis/WETH.json";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useInOutTokens } from "../token/useInOutTokens";
import useContract from "../contracts/useContract";
import { useTx } from "../tx/useTx";
import { useRecoilState } from "recoil";
import { txDataStatus } from "@/recoil/global/transaction";
import { getWETHAddress } from "@/utils/token/isETH";
import useConnectedNetwork from "../network";
// import { useRecoilState } from "recoil";
// import { transactionModalStatus } from "@/recoil/modal/atom";

export default function useWrap() {
  const { SWAPPER_V2_CONTRACT } = useContract();
  const [txData, setTxData] = useRecoilState(txDataStatus);

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

  const { chainName } = useConnectedNetwork();
  const WETH_CONTRACT = chainName && getWETHAddress(chainName);
  const { data: wrapETHData, write: deposit } = useContractWrite({
    address: WETH_CONTRACT as `0x${string}`,
    abi: WethABi,
    functionName: "deposit",
    value: inToken?.amountBN as any,
  });

  const { data: unwrapETHData, write: withdraw } = useContractWrite({
    address: WETH_CONTRACT as `0x${string}`,
    abi: WethABi,
    functionName: "withdraw",
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
  const {} = useTx({
    hash: wrapETHData?.hash,
    txSort: "Wrap",
    tokenAddress: inToken?.tokenAddress as `0x${string}`,
  });
  const {} = useTx({
    hash: unwrapETHData?.hash,
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

  const wrapETH = useCallback(() => {
    try {
      if (inToken && inToken.amountBN) {
        deposit();
      }
    } catch (e) {
      console.log("**wrapTON err**");
      console.log(e);
    }
  }, [inToken]);

  const unwrapWETH = useCallback(() => {
    try {
      if (inToken && inToken.amountBN) {
        withdraw({
          args: [inToken.amountBN],
        });
      }
    } catch (e) {
      console.log("**unwrapWTON err**");
      console.log(e);
    }
  }, [inToken]);

  return { wrapTON, unwrapWTON, wrapETH, unwrapWETH };
}
