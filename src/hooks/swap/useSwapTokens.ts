import { ethers, Contract, BigNumber } from "ethers";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";
import SwapRouterAbi from "@/abis/SwapRouter.json";
import { useProvier } from "../provider/useProvider";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Trade } from "@uniswap/v3-sdk";
import { TradeType, Token } from "@uniswap/sdk-core";
import { useInOutTokens } from "../token/useInOutTokens";
import { useGetMode } from "../mode/useGetMode";
import { useAccount } from "wagmi";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { useSmartRouter } from "../uniswap/useSmartRouter";
import { useTx } from "../tx/useTx";
import { getEncodedPath } from "@/utils/swap/encodePath";
import { useRecoilState, useRecoilValue } from "recoil";
import { uniswapTxSetting } from "@/recoil/uniswap/setting";
import { useSettingValue } from "../uniswap/useSettingValue";
import { calculateGasMargin } from "@/utils/txn/calculateGasMargin";
import { Hash } from "viem";
import { transactionModalStatus } from "@/recoil/modal/atom";
import { calculateGasLimit } from "../contracts/fee/calculateGasLimit";

export type TokenTrade = Trade<Token, Token, TradeType>;

export function useAmountOut() {
  const { provider } = useProvier();
  const { address } = useAccount();
  const { mode } = useGetMode();
  const { inToken, outToken } = useInOutTokens();
  const { UNISWAP_CONTRACT } = useUniswapContracts();
  const [amountOut, setAmountOut] = useState<string | null>(null);
  const { routingPath } = useSmartRouter();

  useEffect(() => {
    const getAmountOut = async () => {
      if (mode === "Swap" && routingPath) {
        const { quoteDecimals } = routingPath;
        return setAmountOut(quoteDecimals);
      }

      return setAmountOut(null);
    };

    getAmountOut().catch((e) => {
      console.log("**getAmountOut err**");
      console.log(e);
    });
  }, [mode, routingPath]);

  const txSettingValue = useRecoilValue(uniswapTxSetting);
  const [transactionHash, setTransactionHash] = useState<Hash | undefined>(
    undefined,
  );
  const [, setModalOpen] = useRecoilState(transactionModalStatus);
  const { slippage } = useSettingValue();

  const sendTransaction = useCallback(
    async (estimateGasForL2?: boolean) => {
      try {
        if (
          routingPath &&
          inToken?.amountBN &&
          outToken &&
          UNISWAP_CONTRACT &&
          provider &&
          mode === "Swap"
        ) {
          const wei = ethers.utils.formatUnits(
            inToken.amountBN.toString(),
            "wei",
          );
          const weiAmount = ethers.BigNumber.from(wei);
          const hexAmount = ethers.utils.hexlify(weiAmount);
          const isETH = inToken.isNativeCurrency?.includes(
            SupportedChainId.MAINNET ||
              SupportedChainId.TITAN ||
              SupportedChainId.TITAN_SEPOLIA ||
              SupportedChainId.SEPOLIA,
          );
          const isOutETH = outToken.isNativeCurrency?.includes(
            SupportedChainId.MAINNET ||
              SupportedChainId.TITAN ||
              SupportedChainId.TITAN_SEPOLIA ||
              SupportedChainId.SEPOLIA,
          );

          if (isOutETH) {
            const SwapRouterContract = new Contract(
              UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
              SwapRouterAbi,
              provider,
            );

            const callData = getEncodedPath({
              route: routingPath.route,
              swapRouterAddress: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
              SwapRouterContract,
              slippage: Number(txSettingValue.slippage) / 100,
              deadlineMin: txSettingValue.deadline,
            });
            const txData = {
              data: callData,
              to: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
              value: routingPath.methodParameters.value,
              from: address,
            };
            const estimatedGas = await provider.estimateGas(txData);

            if (estimateGasForL2) {
              const result = await calculateGasLimit(
                provider,
                txData,
                true,
                true,
              );
              return result;
            }

            const tx = await provider?.getSigner().sendTransaction({
              ...txData,
              gasLimit: calculateGasMargin(estimatedGas),
            });
            if (tx?.hash) return setTransactionHash(tx.hash as Hash);
            return;
          }

          const txData = {
            data: routingPath.methodParameters.calldata,
            to: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
            value: isETH ? hexAmount : routingPath.methodParameters.value,
            from: address,
          };
          const estimatedGas = await provider.estimateGas(txData);

          if (estimateGasForL2) {
            const result = await calculateGasLimit(
              provider,
              txData,
              true,
              true,
            );
            return result;
          }
          const tx = await provider?.getSigner().sendTransaction({
            ...txData,
            gasLimit: calculateGasMargin(estimatedGas),
          });

          if (tx?.hash) return setTransactionHash(tx.hash as Hash);
          return;
        }
      } catch (e) {
        console.log("**sendTransaction err**");
        console.log(e);
        setModalOpen("error");
      } finally {
        setTimeout(() => {
          setTransactionHash(undefined);
        }, 5000);
      }
    },
    [
      routingPath,
      inToken?.amountBN,
      outToken,
      provider,
      txSettingValue,
      UNISWAP_CONTRACT,
    ],
  );

  const [estimatedGasUsageGwei, setEstimatedGasUsageGwei] = useState<
    BigNumber | undefined
  >(undefined);

  useEffect(() => {
    async function getEstimatedGas() {
      const result = await sendTransaction(true);
      if (result) {
        setEstimatedGasUsageGwei(result);
      }
    }
    getEstimatedGas();
  }, [routingPath]);

  // const {
  //   data: _swapData,
  //   sendTransaction,
  //   isError,
  // } = useSendTransaction({
  //   ...txData,
  //   gasLimit: ethers.utils.hexlify(1000000),
  // });

  const {} = useTx({
    hash: transactionHash,
    txSort: "Swap",
    tokenAddress: inToken?.tokenAddress as `0x${string}`,
    tokenOutAddress: outToken?.tokenAddress as `0x${string}`,
  });

  const minimumReceived = useMemo(() => {
    if (amountOut && slippage) {
      const slippagePercent = Number(slippage.toSignificant(5)) / 100;
      return Number(amountOut) * (1 / (1 + slippagePercent));
    }
    return undefined;
  }, [slippage, amountOut]);

  return {
    amountOut,
    minimumReceived,
    callTokenSwap: sendTransaction,
    estimatedGasUsageGwei,
  };
}
