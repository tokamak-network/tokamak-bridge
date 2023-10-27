import { ethers, Contract } from "ethers";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";
import SwapRouterAbi from "@/abis/SwapRouter.json";
import { useProvier } from "../provider/useProvider";
import { useEffect, useState } from "react";
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
  // console.log(routingPath);

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

  // useEffect(() => {
  //   const createTrade = async () => {
  //     if (
  //       mode === "Swap" &&
  //       inToken &&
  //       inToken?.amountBN !== null &&
  //       outToken &&
  //       amountOut
  //     ) {
  //       const currentPoolAddress = computePoolAddress({
  //         factoryAddress: UNISWAP_CONTRACT.POOL_FACTORY_CONTRACT_ADDRESS,
  //         tokenA: inToken.token,
  //         tokenB: outToken.token,
  //         fee: FeeAmount.MEDIUM,
  //         initCodeHashManualOverride:
  //           layer === "L2"
  //             ? "0xa598dd2fba360510c5a8f02f44423a4468e902df5857dbce3ca162a43a3a31ff"
  //             : undefined,
  //       });

  //       const poolContract = new ethers.Contract(
  //         currentPoolAddress,
  //         IUniswapV3PoolABI.abi,
  //         provider
  //       );

  //       const [
  //         //   token0, token1, fee, tickSpacing,
  //         liquidity,
  //         slot0,
  //       ] = await Promise.all([
  //         // poolContract.token0(),
  //         // poolContract.token1(),
  //         // poolContract.fee(),
  //         // poolContract.tickSpacing(),
  //         poolContract.liquidity(),
  //         poolContract.slot0(),
  //       ]);

  //       const pool = new Pool(
  //         inToken.token,
  //         outToken.token,
  //         FeeAmount.MEDIUM,
  //         slot0[0],
  //         liquidity,
  //         slot0[1]
  //       );

  //       const swapRoute = new Route([pool], inToken.token, outToken.token);

  //       const uncheckedTrade = Trade.createUncheckedTrade({
  //         route: swapRoute,
  //         inputAmount: CurrencyAmount.fromRawAmount(
  //           inToken.token,
  //           fromReadableAmount(
  //             Number(inToken.parsedAmount?.replaceAll(",", "")),
  //             inToken.decimals
  //           ).toString()
  //         ),
  //         outputAmount: CurrencyAmount.fromRawAmount(
  //           outToken.token,
  //           fromReadableAmount(Number(amountOut), outToken.decimals).toString()
  //         ),
  //         tradeType: TradeType.EXACT_INPUT,
  //       });

  //       // const uncheckedTrade = await Trade.exactIn(swapRoute,CurrencyAmount.fromRawAmount(
  //       //   inToken.token,
  //       //   fromReadableAmount(
  //       //     Number(inToken.parsedAmount),
  //       //     inToken.decimals
  //       //   ).toString()
  //       // ))

  //       return setTrade(uncheckedTrade);
  //     }
  //     return setTrade(null);
  //   };
  //   createTrade().catch((e) => {
  //     console.log("**createTrade err**");
  //     console.log(e);
  //   });
  // }, [inToken, outToken, amountOut, layer, mode]);

  // const callTokenSwap = useCallback(async () => {
  //   if (trade && inToken && address && inToken.amountBN) {
  //     try {
  //       // // Give approval to the router to spend the token
  //       // const tokenApproval = await getTokenTransferApproval(inToken.token);
  //       // console.log(tokenApproval);

  //       // // Fail if transfer approvals do not go through
  //       // if (tokenApproval !== TransactionState.Sent) {
  //       //   return TransactionState.Failed;
  //       // }

  //       const options: SwapOptions = {
  //         slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
  //         deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
  //         recipient: address,
  //       };
  //       const methodParameters = SwapRouter.swapCallParameters(
  //         [trade],
  //         options
  //       );

  //       const wei = ethers.utils.formatUnits(
  //         inToken.amountBN.toString(),
  //         "wei"
  //       );
  //       const weiAmount = ethers.BigNumber.from(wei);
  //       const hexAmount = ethers.utils.hexlify(weiAmount);

  //       const isETH = inToken.isNativeCurrency?.includes(
  //         SupportedChainId.MAINNET || SupportedChainId.GOERLI
  //       );

  // const tx = {
  //   data: methodParameters.calldata as `0x{string}`,
  //   to: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS,
  //   value: isETH ? hexAmount : methodParameters.value,
  //   from: address,
  //   // maxFeePerGas: "250000",
  //   // maxPriorityFeePerGas: "250000",
  //   // gasLimit: "21000",
  //   // gasPrice: gasPrice.toString(),
  // };
  //       if (tx) {
  //         setModalOpen("confirming");
  //         const res = await sendTransaction(tx);
  //         if (res === "Sent") {
  //           return setModalOpen("confirmed");
  //         }
  //         if (res === "Rejected") {
  //           return setModalOpen("error");
  //         }
  //       }
  //     } catch (e) {
  //       console.log("callTokenSwap");
  //       console.log(e);
  //       setModalOpen("error");
  //     }
  //   }
  // }, [trade, address]);

  const [txData, setTxData] = useState<any>(undefined);
  const txSettingValue = useRecoilValue(uniswapTxSetting);

  useEffect(() => {
    const getSwapTxnData = async () => {
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
            SupportedChainId.TITAN
        );
        const isOutETH = outToken.isNativeCurrency?.includes(
          SupportedChainId.MAINNET ||
            SupportedChainId.GOERLI ||
            SupportedChainId.TITAN
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

          const tx = {
            data: callData,
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

  return { amountOut, callTokenSwap: sendTransaction, isError };
}
