import { useCallback, useEffect, useMemo, useState } from "react";
import SwapperV2ABI from "@/abis/SwapperV2.json";
import WethABi from "@/abis/WETH.json";
import { useAccount, useContractWrite, usePublicClient } from "wagmi";
import { useInOutTokens } from "../token/useInOutTokens";
import useContract from "../contracts/useContract";
import { useTx } from "../tx/useTx";
import { getWETHAddress } from "@/utils/token/isETH";
import useConnectedNetwork from "../network";
import { useProvier } from "../provider/useProvider";
import { BigNumber, Contract, ethers } from "ethers";
import { calculateGasMargin } from "@/utils/txn/calculateGasMargin";
import { getProviderOrSigner } from "@/utils/web3/getEthersProviderOrSinger";
import { useGetMode } from "../mode/useGetMode";
import OutToken from "@/app/BridgeSwap/components/OutToken";
import { asL2Provider } from "@tokamak-network/titan-sdk";
// import { useRecoilState } from "recoil";
// import { transactionModalStatus } from "@/recoil/modal/atom";

export default function useWrap() {
  const { SWAPPER_V2_CONTRACT } = useContract();
  const { provider } = useProvier();
  const { address } = useAccount();
  const [estimatedGasUsage, setEstimatedGasUsage] = useState<
    BigNumber | undefined
  >(undefined);
  const { mode } = useGetMode();
  const { layer } = useConnectedNetwork();

  const { inToken, outToken } = useInOutTokens();
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

  const { chainName, isSupportedChain } = useConnectedNetwork();
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

  const isLayer2 = useMemo(() => layer === "L2", [layer]);

  const ETHWrapContract = useMemo(() => {
    try {
      if (isSupportedChain) {
        return new Contract(
          WETH_CONTRACT as string,
          WethABi,
          getProviderOrSigner(provider, address)
        );
      }
    } catch (e) {
      console.log("**ETHWrapContract err**");
      console.log(e);
    }
  }, [isSupportedChain, WETH_CONTRACT, WethABi, provider, address]);

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
    txSort: "ETH-Wrap",
    tokenAddress: inToken?.tokenAddress as `0x${string}`,
  });
  const {} = useTx({
    hash: unwrapETHData?.hash,
    txSort: "ETH-Unwrap",
    tokenAddress: inToken?.tokenAddress as `0x${string}`,
  });

  const wrapTON = useCallback(
    async (estimateGasUsage?: boolean) => {
      if (inToken && inToken.amountBN) {
        const estimateGas = await WrapContract.estimateGas.tonToWton(
          inToken.amountBN
        );
        if (estimateGasUsage) return estimateGas;
        try {
          tonWton({
            args: [inToken.amountBN],
            // gas: calculateGasMargin(estimateGas).toBigInt(),
          });
        } catch (e) {
          console.log("**wrapTON err**");
          console.log(e);
        }
      }
    },
    [inToken, WrapContract]
  );

  const unwrapWTON = useCallback(
    async (estimateGasUsage?: boolean) => {
      if (inToken && inToken.amountBN) {
        const estimateGas = await WrapContract.estimateGas.wtonToTon(
          inToken.amountBN
        );
        if (estimateGasUsage) return estimateGas;
        try {
          wtonTon({
            args: [inToken.amountBN],
            // gas: calculateGasMargin(estimateGas).toBigInt(),
          });
        } catch (e) {
          console.log("**unwrapWTON err**");
          console.log(e);
        }
      }
    },
    [inToken, WrapContract]
  );

  const wrapETH = useCallback(
    async (estimateGasUsage?: boolean) => {
      if (inToken && inToken.amountBN && ETHWrapContract && provider) {
        let estimateGas;
        if (layer === "L2") {
          const calldata =
            ETHWrapContract.interface.encodeFunctionData("deposit");
          const l2Provider = asL2Provider(provider);
          estimateGas = await l2Provider.estimateTotalGasCost({
            to: ETHWrapContract.address,
            data: calldata,
          });
        }
        if (layer === "L1") {
          estimateGas = await ETHWrapContract.estimateGas.deposit();
        }
        if (estimateGasUsage) return estimateGas;
        try {
          deposit({});
        } catch (e) {
          console.log("**wrapTON err**");
          console.log(e);
        }
      }
    },
    [inToken, ETHWrapContract, provider, isLayer2]
  );

  const unwrapWETH = useCallback(
    async (estimateGasUsage?: boolean) => {
      if (inToken && inToken.amountBN && ETHWrapContract && provider) {
        let estimateGas;
        if (layer === "L2") {
          const calldata =
            ETHWrapContract.interface.encodeFunctionData("withdraw");
          const l2Provider = asL2Provider(provider);
          estimateGas = await l2Provider.estimateTotalGasCost({
            to: ETHWrapContract.address,
            data: calldata,
          });
        }
        if (layer === "L1") {
          estimateGas = await ETHWrapContract.estimateGas.withdraw();
        }

        if (estimateGasUsage) return estimateGas;
        try {
          withdraw({
            args: [inToken.amountBN],
            // gas: calculateGasMargin(estimateGas).toBigInt(),
          });
        } catch (e) {
          console.log("**unwrapWTON err**");
          console.log(e);
        }
      }
    },
    [inToken, ETHWrapContract, provider]
  );

  useEffect(() => {
    const fetchEstimatedGasUsage = async () => {
      const estimatedGas =
        mode === "Wrap"
          ? await wrapTON(true)
          : mode === "Unwrap"
          ? await unwrapWTON(true)
          : mode === "ETH-Wrap"
          ? await wrapETH(true)
          : mode === "ETH-Unwrap"
          ? await unwrapWETH(true)
          : "";
      if (estimatedGas) setEstimatedGasUsage(estimatedGas);
    };

    fetchEstimatedGasUsage();
  }, [mode, inToken, outToken]);

  return { wrapTON, unwrapWTON, wrapETH, unwrapWETH, estimatedGasUsage };
}
