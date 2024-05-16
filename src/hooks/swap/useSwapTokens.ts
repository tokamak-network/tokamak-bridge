import { ethers, Contract, BigNumber } from "ethers";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";
import SwapRouterAbi from "@/abis/SwapRouter.json";
import { useProvier } from "../provider/useProvider";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Trade } from "@uniswap/v3-sdk";
import { TradeType, Token } from "@uniswap/sdk-core";
import { useInOutTokens } from "../token/useInOutTokens";
import { useGetMode } from "../mode/useGetMode";
import { useAccount, useSendTransaction } from "wagmi";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { useSmartRouter } from "../uniswap/useSmartRouter";
import { useTx } from "../tx/useTx";
import { getEncodedPath } from "@/utils/swap/encodePath";
import { useRecoilState, useRecoilValue } from "recoil";
import { uniswapTxSetting } from "@/recoil/uniswap/setting";
import { useSettingValue } from "../uniswap/useSettingValue";
import useConnectedNetwork from "../network";
import { asL2Provider } from "@tokamak-network/titan-sdk";
import { calculateGasMargin } from "@/utils/txn/calculateGasMargin";
import { Hash } from "viem";
import { transactionModalStatus } from "@/recoil/modal/atom";

export type TokenTrade = Trade<Token, Token, TradeType>;

export function useSwapTokens() {}

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

  const [txData, setTxData] = useState<any>(undefined);
  const txSettingValue = useRecoilValue(uniswapTxSetting);

  useEffect(() => {
    const getSwapTxData = async () => {
      if (
        routingPath &&
        inToken?.amountBN &&
        outToken &&
        UNISWAP_CONTRACT &&
        provider
      ) {
        const wei = ethers.utils.formatUnits(
          inToken.amountBN.toString(),
          "wei"
        );
        const weiAmount = ethers.BigNumber.from(wei);
        const hexAmount = ethers.utils.hexlify(weiAmount);
        const isETH = inToken.isNativeCurrency?.includes(
          SupportedChainId.MAINNET ||
            SupportedChainId.TITAN ||
            SupportedChainId.TITAN_SEPOLIA ||
            SupportedChainId.SEPOLIA
        );
        const isOutETH = outToken.isNativeCurrency?.includes(
          SupportedChainId.MAINNET ||
            SupportedChainId.TITAN ||
            SupportedChainId.TITAN_SEPOLIA ||
            SupportedChainId.SEPOLIA
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
          };

          return setTxData(tx);
        }
        const tx = {
          data: routingPath.methodParameters.calldata,
          to: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
          value: isETH ? hexAmount : routingPath.methodParameters.value,
          from: address,
        };

        return setTxData(tx);
      }
    };
    getSwapTxData();
  }, [
    routingPath?.methodParameters,
    inToken?.amountBN,
    outToken,
    provider,
    txSettingValue,
    UNISWAP_CONTRACT,
  ]);

  const [estimatedGasUsageGwei, setEstimatedGasUsageGwei] = useState<
    BigNumber | undefined
  >(undefined);
  const { layer } = useConnectedNetwork();

  useEffect(() => {
    async function getEstimatedGas() {
      if (txData && provider && layer) {
        if (layer === "L2") {
          const l2Provider = asL2Provider(provider);
          const gas = await l2Provider.estimateGas(txData);
          return setEstimatedGasUsageGwei(gas);
        }
      }
    }
    getEstimatedGas();
  }, [txData, provider, layer]);

  // const {
  //   data: _swapData,
  //   sendTransaction,
  //   isError,
  // } = useSendTransaction({
  //   ...txData,
  //   gasLimit: ethers.utils.hexlify(1000000),
  // });

  const [transactionHash, setTransactionHash] = useState<Hash | undefined>(
    undefined
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [, setModalOpen] = useRecoilState(transactionModalStatus);

  const sendTransaction = useCallback(async () => {
    try {
      // setTransactionHash(undefined);
      // setModalOpen(null);
      // if (
      //   window.ethereum &&
      //   routingPath &&
      //   inToken?.amountBN &&
      //   outToken &&
      //   UNISWAP_CONTRACT &&
      //   provider
      // ) {
      //   const provider = new ethers.providers.Web3Provider(window.ethereum);
      //   const wei = ethers.utils.formatUnits(
      //     inToken.amountBN.toString(),
      //     "wei"
      //   );
      //   const weiAmount = ethers.BigNumber.from(wei);
      //   const hexAmount = ethers.utils.hexlify(weiAmount);
      //   const isETH = inToken.isNativeCurrency?.includes(
      //     SupportedChainId.MAINNET ||
      //       SupportedChainId.TITAN ||
      //       SupportedChainId.TITAN_SEPOLIA ||
      //       SupportedChainId.SEPOLIA
      //   );
      //   const isOutETH = outToken.isNativeCurrency?.includes(
      //     SupportedChainId.MAINNET ||
      //       SupportedChainId.TITAN ||
      //       SupportedChainId.TITAN_SEPOLIA ||
      //       SupportedChainId.SEPOLIA
      //   );
      //   let txData = undefined;
      //   if (isOutETH) {
      //     const SwapRouterContract = new Contract(
      //       UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
      //       SwapRouterAbi,
      //       provider
      //     );
      //     const callData = getEncodedPath({
      //       route: routingPath.route,
      //       swapRouterAddress: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
      //       SwapRouterContract,
      //       slippage: Number(txSettingValue.slippage) / 100,
      //       deadlineMin: txSettingValue.deadline,
      //     });
      //     txData = {
      //       data: callData,
      //       to: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
      //       value: routingPath.methodParameters.value,
      //       from: address,
      //     };
      //   } else {
      //     txData = {
      //       data: routingPath.methodParameters.calldata,
      //       to: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2,
      //       value: isETH ? hexAmount : routingPath.methodParameters.value,
      //       from: address,
      //     };
      //   }
      //   if (!txData) {
      //     return setModalOpen("error");
      //   }
      //   setModalOpen("confirming");
      //   const signer = provider.getSigner();
      //   const estimatedGas = await provider.estimateGas(txData);
      //   const gasLimit = calculateGasMargin(estimatedGas);
      //   const transaction = {
      //     ...txData,
      //     gasLimit,
      //   };
      //   const transactionResponse = await signer.sendTransaction(transaction);
      //   // Listen for the transactionHash event
      //   const receipt = await transactionResponse.wait();
      //   if (receipt) {
      //     return setTransactionHash(receipt.transactionHash as Hash);
      //   }
      // }
      // return setModalOpen("error");
    } catch (e) {
      console.log("**send Swap Transaction err**");
      console.log(e);
      setIsError(true);
      setModalOpen("error");
    }
  }, [
    window.ethereum,
    routingPath?.methodParameters,
    inToken?.amountBN,
    outToken,
    provider,
    txSettingValue,
    UNISWAP_CONTRACT,
  ]);

  const {} = useTx({
    hash: transactionHash,
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
    estimatedGasUsageGwei,
  };
}
