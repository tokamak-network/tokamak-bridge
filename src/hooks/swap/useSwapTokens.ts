import { ethers, Contract, BigNumber } from "ethers";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";
import SwapRouterAbi from "@/abis/SwapRouter.json";
import { useProvier } from "../provider/useProvider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Trade } from "@uniswap/v3-sdk";
import { TradeType, Token } from "@uniswap/sdk-core";
import { useGetMode } from "../mode/useGetMode";

import { useAccount, useSendTransaction } from "wagmi";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { useSmartRouter } from "../uniswap/useSmartRouter";
import { useTx } from "../tx/useTx";
import { getEncodedPath } from "@/utils/swap/encodePath";
import { useRecoilState, useRecoilValue } from "recoil";
import { uniswapTxSetting } from "@/recoil/uniswap/setting";
import { useInOutTokens } from "../token/useInOutTokens";
import { calculateGasMargin } from "@/utils/txn/calculateGasMargin";
import { useSettingValue } from "../uniswap/useSettingValue";
import { Hash } from "viem";
import { transactionModalStatus } from "@/recoil/modal/atom";

export type TokenTrade = Trade<Token, Token, TradeType>;
let count = 0;
export function useSwapTokens() {
  const { provider } = useProvier();
  const { address } = useAccount();
  const { mode } = useGetMode();
  const { inToken, outToken } = useInOutTokens();
  const { UNISWAP_CONTRACT, QUOTER_CONTRACT } = useUniswapContracts();
  const { routingPath } = useSmartRouter();
  const [isError, setIsError] = useState<boolean>(false);

  const amountOut = useMemo(() => {
    if (mode === "Swap" && routingPath) {
      const { quoteDecimals } = routingPath;
      return quoteDecimals;
    }
    return null;
  }, [mode, routingPath]);

  const [txData, setTxData] = useState<any>(undefined);
  const txSettingValue = useRecoilValue(uniswapTxSetting);

  const [txHashToSwap, setTxHashToSwap] = useState<Hash | undefined>(undefined);
  const [, setModalOpen] = useRecoilState(transactionModalStatus);

  const callTokenSwap = useCallback(
    async (estimateGasUsage?: boolean) => {
      if (routingPath && inToken?.amountBN && outToken) {
        // console.log(routingPath);

        const wei = ethers.utils.formatUnits(
          inToken.amountBN.toString(),
          "wei"
        );
        const weiAmount = ethers.BigNumber.from(wei);
        const hexAmount = ethers.utils.hexlify(weiAmount);
        const isETH = inToken.isNativeCurrency?.includes(
          SupportedChainId.MAINNET ||
            SupportedChainId.GOERLI ||
            SupportedChainId.TITAN ||
            SupportedChainId.DARIUS
        );
        const isOutETH = outToken.isNativeCurrency?.includes(
          SupportedChainId.MAINNET ||
            SupportedChainId.GOERLI ||
            SupportedChainId.TITAN ||
            SupportedChainId.DARIUS
        );

        if (isOutETH) {
          const SwapRouterContract = new Contract(
            UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
            SwapRouterAbi,
            provider
          );

          const callData = getEncodedPath({
            route: routingPath.route,
            swapRouterAddress: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
            SwapRouterContract,
            slippage: Number(txSettingValue.slippage) / 100,
            deadlineMin: txSettingValue.deadline,
          });
          const txn = {
            data: callData,
            to: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
            value: routingPath.methodParameters.value,
            from: address,
          };

          const estimatedGas = await provider.estimateGas(txn);
          if (estimateGasUsage) return estimatedGas;

          try {
            if (estimatedGas) {
              const tx = await provider.getSigner().sendTransaction({
                ...txn,
                gasLimit: calculateGasMargin(estimatedGas),
              });
              if (tx.hash) return setTxHashToSwap(tx.hash as Hash);
              return;
            }
            return;
          } catch (e) {
            setModalOpen("error");
            // setIsError(true);
          }
        }

        const txn = {
          data: routingPath.methodParameters.calldata,
          to: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
          value: isETH ? hexAmount : routingPath.methodParameters.value,
          from: address,
        };
        const estimatedGas = await provider.estimateGas(txn);
        if (estimateGasUsage) return estimatedGas;
        try {
          if (estimatedGas) {
            const tx = await provider.getSigner().sendTransaction({
              ...txn,
              gasLimit: calculateGasMargin(estimatedGas),
            });
            if (tx.hash) return setTxHashToSwap(tx.hash as Hash);
            return;
          }
        } catch (e) {
          setModalOpen("error");
          // setIsError(true);
        }
      }
    },
    [routingPath?.methodParameters, inToken, outToken, provider, txSettingValue]
  );

  const {} = useTx({
    hash: txHashToSwap,
    txSort: "Swap",
    tokenAddress: inToken?.tokenAddress as `0x${string}`,
    tokenOutAddress: outToken?.tokenAddress as `0x${string}`,
  });

  const { slippage } = useSettingValue();
  const minimumReceived = useMemo(() => {
    if (amountOut && slippage) {
      const slippagePercent = Number(slippage.toSignificant(5)) / 100;
      return Number(amountOut) * (1 / (1 + slippagePercent));
    }
    return undefined;
  }, [slippage, amountOut]);

  const [estimatedGasUsage, setEstimatedGasUsage] = useState<
    BigNumber | undefined
  >(undefined);

  useEffect(() => {
    const fetchEstimatedGasusage = async () => {
      const estimatedGasUsage = await callTokenSwap(true);
      if (estimatedGasUsage) setEstimatedGasUsage(estimatedGasUsage);
    };
    if (amountOut) {
      fetchEstimatedGasusage();
    }
  }, [amountOut]);

  return {
    amountOut,
    minimumReceived,
    callTokenSwap,
    isError,
    estimatedGasUsage,
  };
}
