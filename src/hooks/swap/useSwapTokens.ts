import { ethers, Contract } from "ethers";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";
import SwapRouterAbi from "@/abis/SwapRouter.json";
import { useProvier } from "../provider/useProvider";
import { useEffect, useMemo, useState } from "react";
import { Trade } from "@uniswap/v3-sdk";
import { TradeType, Token } from "@uniswap/sdk-core";
import { useGetMode } from "../mode/useGetMode";

import { useAccount, useSendTransaction } from "wagmi";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { useSmartRouter } from "../uniswap/useSmartRouter";
import { useTx } from "../tx/useTx";
import { getEncodedPath } from "@/utils/swap/encodePath";
import { useRecoilValue } from "recoil";
import { uniswapTxSetting } from "@/recoil/uniswap/setting";
import { useInOutTokens } from "../token/useInOutTokens";
import { calculateGasMargin } from "@/utils/txn/calculateGasMargin";
import { useSettingValue } from "../uniswap/useSettingValue";

export type TokenTrade = Trade<Token, Token, TradeType>;

export function useSwapTokens() {}

export function useAmountOut() {
  const { provider } = useProvier();
  const { address } = useAccount();
  const { mode } = useGetMode();

  const { inToken, outToken } = useInOutTokens();
  const { UNISWAP_CONTRACT, QUOTER_CONTRACT } = useUniswapContracts();

  const [amountOut, setAmountOut] = useState<string | null>(null);
  const { routingPath } = useSmartRouter();

  useEffect(() => {
    const getAmountOut = async () => {
      if (mode === "Swap" && routingPath) {
        // const quotedAmountOut =
        //   await QUOTER_CONTRACT.callStatic.quoteExactInputSingle(
        //     inToken.token.address,
        //     outToken.token.address,
        //     FeeAmount.MEDIUM,
        //     inToken.amountBN,
        //     // fromReadableAmount(
        //     //   Number(inToken.parsedAmount),
        //     //   inToken.decimals
        //     // ).toString(),
        //     0
        //   );

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

  const [txData, setTxData] = useState<any>(undefined);
  const txSettingValue = useRecoilValue(uniswapTxSetting);

  useEffect(() => {
    const getSwapTxnData = async () => {
      if (routingPath && inToken?.amountBN && outToken) {
        const wei = ethers.utils.formatUnits(
          inToken.amountBN.toString(),
          "wei"
        );
        const weiAmount = ethers.BigNumber.from(wei);
        const hexAmount = ethers.utils.hexlify(weiAmount);
        const isETH = inToken.isNativeCurrency?.includes(
          SupportedChainId.MAINNET ||
            SupportedChainId.GOERLI ||
            SupportedChainId.TITAN
        );
        const isOutETH = outToken.isNativeCurrency?.includes(
          SupportedChainId.MAINNET ||
            SupportedChainId.GOERLI ||
            SupportedChainId.TITAN
        );

        if (isOutETH) {
          const tx = {
            data: routingPath.methodParameters.calldata,
            to: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
            value: routingPath.methodParameters.value,
            from: address,
            // maxFeePerGas: "250000",
            // maxPriorityFeePerGas: "250000",
            // gasLimit: "21000",
            // gasPrice: gasPrice.toString(),
          };
          const estimateGas = await provider.estimateGas(tx);

          return setTxData({ ...tx, gas: calculateGasMargin(estimateGas) });
        }

        const tx = {
          data: routingPath.methodParameters.calldata,
          to: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
          value: isETH ? hexAmount : routingPath.methodParameters.value,
          from: address,
          // maxFeePerGas: "250000",
          // maxPriorityFeePerGas: "250000",
          // gasLimit: "21000",
          // gasPrice: gasPrice.toString(),
        };
        const estimateGas = await provider.estimateGas(tx);
        return setTxData({ ...tx, gas: calculateGasMargin(estimateGas) });
        // const res = await sendTransaction(tx);
        // console.log(res);
      }
    };
    getSwapTxnData();
  }, [
    routingPath?.methodParameters,
    inToken,
    outToken,
    provider,
    txSettingValue,
  ]);

  const {
    data: _swapData,
    sendTransaction,
    isError,
    isSuccess,
  } = useSendTransaction(txData);

  const {} = useTx({
    hash: _swapData?.hash,
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

  return {
    amountOut,
    minimumReceived,
    callTokenSwap: sendTransaction,
    isError,
    estimatedGasUsage: txData?.gas,
  };
}
