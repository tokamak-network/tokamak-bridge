import { useCallback } from "react";
import SwapperV2ABI from "@/abis/SwapperV2.json";
import WethABi from "@/abis/WETH.json";
import { useAccount, useContractWrite, usePublicClient } from "wagmi";
import { useInOutTokens } from "../token/useInOutTokens";
import useContract from "../contracts/useContract";
import { useTx } from "../tx/useTx";
import { getWETHAddress } from "@/utils/token/isETH";
import useConnectedNetwork from "../network";
import { useProvier } from "../provider/useProvider";
import { Contract } from "ethers";
import { calculateGasMargin } from "@/utils/txn/calculateGasMargin";
import { getProviderOrSigner } from "@/utils/web3/getEthersProviderOrSinger";
// import { useRecoilState } from "recoil";
// import { transactionModalStatus } from "@/recoil/modal/atom";

export default function useWrap() {
  const { SWAPPER_V2_CONTRACT } = useContract();
  const { provider } = useProvier();
  const { address } = useAccount();

  const { inToken } = useInOutTokens();
  const { data, write: tonWton } = useContractWrite({
    address: SWAPPER_V2_CONTRACT as `0x${string}`,
    abi: SwapperV2ABI.abi,
    functionName: "tonToWton",
  });
  const WrapContract = new Contract(
    SWAPPER_V2_CONTRACT,
    SwapperV2ABI.abi,
    getProviderOrSigner(provider, address)
  );

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
  const ETHWrapContract = new Contract(
    WETH_CONTRACT as string,
    WethABi,
    getProviderOrSigner(provider, address)
  );

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

  const wrapTON = useCallback(async () => {
    try {
      if (inToken && inToken.amountBN) {
        const estimateGas = await WrapContract.estimateGas.tonToWton(
          inToken.amountBN
        );
        tonWton({
          args: [inToken.amountBN],
          gas: calculateGasMargin(estimateGas).toBigInt(),
        });
      }
    } catch (e) {
      console.log("**wrapTON err**");
      console.log(e);
    }
  }, [inToken, WrapContract]);

  const unwrapWTON = useCallback(async () => {
    try {
      if (inToken && inToken.amountBN) {
        const estimateGas = await WrapContract.estimateGas.wtonToTon(
          inToken.amountBN
        );
        wtonTon({
          args: [inToken.amountBN],
          gas: calculateGasMargin(estimateGas).toBigInt(),
        });
      }
    } catch (e) {
      console.log("**unwrapWTON err**");
      console.log(e);
    }
  }, [inToken, WrapContract]);

  const wrapETH = useCallback(async () => {
    try {
      if (inToken && inToken.amountBN) {
        const estimateGas = await ETHWrapContract.estimateGas.deposit();
        deposit({
          gas: calculateGasMargin(estimateGas).toBigInt(),
        });
      }
    } catch (e) {
      console.log("**wrapTON err**");
      console.log(e);
    }
  }, [inToken, ETHWrapContract]);

  const unwrapWETH = useCallback(async () => {
    try {
      if (inToken && inToken.amountBN) {
        const estimateGas = await ETHWrapContract.estimateGas.unwrapWETH();
        withdraw({
          args: [inToken.amountBN],
          gas: calculateGasMargin(estimateGas).toBigInt(),
        });
      }
    } catch (e) {
      console.log("**unwrapWTON err**");
      console.log(e);
    }
  }, [inToken, ETHWrapContract]);

  return { wrapTON, unwrapWTON, wrapETH, unwrapWETH };
}
