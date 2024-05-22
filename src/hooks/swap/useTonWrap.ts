import { useCallback, useEffect, useMemo, useState } from "react";
import SwapperV2ABI from "@/abis/SwapperV2.json";
import WethABi from "@/abis/WETH.json";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
} from "wagmi";
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
import { asL2Provider } from "@tokamak-network/titan-sdk";
import { l2Provider } from "@/config/l2Provider";

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
        const estimateGasWithBuffer = calculateGasMargin(estimateGas);
        if (estimateGasUsage) return estimateGasWithBuffer;
        try {
          tonWton({
            args: [inToken.amountBN],
            gas: estimateGasWithBuffer.toBigInt(),
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
        const estimateGasWithBuffer = calculateGasMargin(estimateGas);
        if (estimateGasUsage) return estimateGasWithBuffer;
        try {
          wtonTon({
            args: [inToken.amountBN],
            gas: estimateGasWithBuffer.toBigInt(),
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
        try {
          let estimateGas;
          let estimatedGasForL2 = undefined;
          if (isLayer2) {
            const calldata =
              ETHWrapContract.interface.encodeFunctionData("deposit");
            const l2Provider = asL2Provider(provider);
            const txData = {
              to: ETHWrapContract.address,
              data: calldata,
            };

            estimateGas = await l2Provider.estimateTotalGasCost(txData);
            estimatedGasForL2 = await provider.estimateGas(txData);
            estimatedGasForL2 = calculateGasMargin(estimatedGasForL2);
          } else {
            const calldata =
              ETHWrapContract.interface.encodeFunctionData("deposit");
            estimateGas = await provider.estimateGas({
              to: ETHWrapContract.address,
              data: calldata,
            });
          }
          const estimateGasWithBuffer = calculateGasMargin(estimateGas);

          if (estimateGasUsage) return estimateGas;

          if (
            (isLayer2 && estimatedGasForL2) ||
            (!isLayer2 && estimateGasWithBuffer)
          )
            deposit({
              gas:
                layer === "L2"
                  ? estimatedGasForL2?.toBigInt()
                  : estimateGasWithBuffer.toBigInt(),
            });
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
        let estimateGas = undefined;
        let estimatedGasForL2 = undefined;

        if (isLayer2) {
          const calldata = ETHWrapContract.interface.encodeFunctionData(
            "withdraw",
            [inToken.amountBN]
          );
          const l2Provider = asL2Provider(provider);
          const txData = {
            to: ETHWrapContract.address,
            data: calldata,
            from: address,
          };

          estimateGas = await l2Provider.estimateTotalGasCost(txData);
          estimatedGasForL2 = await provider.estimateGas(txData);
          estimatedGasForL2 = calculateGasMargin(estimatedGasForL2);
        } else {
          estimateGas = await ETHWrapContract.estimateGas.withdraw(
            inToken.amountBN
          );
        }
        const estimateGasWithBuffer = calculateGasMargin(estimateGas);

        if (estimateGasUsage) return estimateGasWithBuffer;

        if (
          (isLayer2 && estimatedGasForL2) ||
          (!isLayer2 && estimateGasWithBuffer)
        ) {
          withdraw({
            args: [inToken.amountBN],
            gas:
              layer === "L2"
                ? estimatedGasForL2?.toBigInt()
                : estimateGasWithBuffer.toBigInt(),
          });
        }
      }
    },
    [inToken, ETHWrapContract, provider, isLayer2]
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
          : undefined;
      if (estimatedGas) setEstimatedGasUsage(estimatedGas);
    };

    fetchEstimatedGasUsage();
  }, [mode, inToken, outToken]);

  return { wrapTON, unwrapWTON, wrapETH, unwrapWETH, estimatedGasUsage };
}
