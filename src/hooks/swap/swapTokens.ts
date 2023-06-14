import { ethers } from "ethers";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import Swap from "@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json";
import { useProvier } from "../provider/useProvider";
import { useCallback, useEffect, useState } from "react";
import { SelectedToken, actionMode } from "@/recoil/bridgeSwap/atom";
import {
  computePoolAddress,
  FeeAmount,
  Pool,
  Trade,
  Route,
  SwapOptions,
  SwapRouter,
} from "@uniswap/v3-sdk";
import { CurrencyAmount, TradeType, Token, Percent } from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import {
  fromReadableAmount,
  toReadableAmount,
} from "@/utils/uniswap/libs/converstion";
import { useInOutTokens } from "../token/useInOutTokens";
import JSBI from "jsbi";
import { useAccount, useContractWrite } from "wagmi";
import { sendTransaction } from "@/utils/uniswap/libs/provider";
import useConnectedNetwork from "../network";
import { useGetMode } from "../mode/useGetMode";
import useContract from "@/hooks/contracts/useContract";

export type TokenTrade = Trade<Token, Token, TradeType>;

export function useSwapTokens() {}

export function useAmountOut() {
  const { provider } = useProvier();
  const { address } = useAccount();

  const { inToken, outToken } = useInOutTokens();
  const { UNISWAP_CONTRACT } = useContract();
  const { layer } = useConnectedNetwork();

  const [amountOut, setAmountOut] = useState<string | null>(null);
  const [trade, setTrade] = useState<TokenTrade | null>(null);
  const [estimatedGas, setEstimatedGas] = useState<bigint | undefined>(
    undefined
  );

  const quoterContract = new ethers.Contract(
    UNISWAP_CONTRACT.QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    provider
  );

  // const { write } = useContractWrite({
  //   address: L1_UniswapContracts.SWAP_ROUTER_ADDRESS,
  //   abi: IUniswapV3PoolABI.abi,
  // });

  useEffect(() => {
    const getAmountOut = async () => {
      if (inToken && inToken?.amountBN !== null && outToken?.address) {
        const quotedAmountOut =
          await quoterContract.callStatic.quoteExactInputSingle(
            inToken.token.address,
            outToken.token.address,
            FeeAmount.MEDIUM,
            fromReadableAmount(
              Number(inToken.parsedAmount),
              inToken.decimals
            ).toString(),
            0
          );

        return setAmountOut(
          toReadableAmount(quotedAmountOut, outToken.decimals)
        );
      }
      return setAmountOut(null);
    };

    getAmountOut().catch((e) => {
      console.log("**getAmountOut err**");
      console.log(e);
    });
  }, [UNISWAP_CONTRACT, inToken, outToken, provider]);

  useEffect(() => {
    const createTrade = async () => {
      if (inToken && inToken?.amountBN !== null && outToken && amountOut) {
        const currentPoolAddress = computePoolAddress({
          factoryAddress: UNISWAP_CONTRACT.POOL_FACTORY_CONTRACT_ADDRESS,
          tokenA: inToken.token,
          tokenB: outToken.token,
          fee: FeeAmount.MEDIUM,
          initCodeHashManualOverride:
            layer === "L2"
              ? "0xa598dd2fba360510c5a8f02f44423a4468e902df5857dbce3ca162a43a3a31ff"
              : undefined,
        });

        const poolContract = new ethers.Contract(
          currentPoolAddress,
          IUniswapV3PoolABI.abi,
          provider
        );

        const [
          //   token0, token1, fee, tickSpacing,
          liquidity,
          slot0,
        ] = await Promise.all([
          // poolContract.token0(),
          // poolContract.token1(),
          // poolContract.fee(),
          // poolContract.tickSpacing(),
          poolContract.liquidity(),
          poolContract.slot0(),
        ]);

        const pool = new Pool(
          inToken.token,
          outToken.token,
          FeeAmount.MEDIUM,
          slot0[0],
          liquidity,
          slot0[1]
        );

        const swapRoute = new Route([pool], inToken.token, outToken.token);

        const uncheckedTrade = Trade.createUncheckedTrade({
          route: swapRoute,
          inputAmount: CurrencyAmount.fromRawAmount(
            inToken.token,
            fromReadableAmount(
              Number(inToken.parsedAmount),
              inToken.decimals
            ).toString()
          ),
          outputAmount: CurrencyAmount.fromRawAmount(
            outToken.token,
            fromReadableAmount(Number(amountOut), outToken.decimals).toString()
          ),
          tradeType: TradeType.EXACT_INPUT,
        });

        return setTrade(uncheckedTrade);
      }
      return setTrade(null);
    };
    createTrade().catch((e) => {
      console.log("**createTrade err**");
      console.log(e);
    });
  }, [inToken, outToken, amountOut, UNISWAP_CONTRACT, layer]);

  const callTokenSwap = useCallback(async () => {
    if (trade && inToken && address) {
      try {
        // // Give approval to the router to spend the token
        // const tokenApproval = await getTokenTransferApproval(inToken.token);
        // console.log(tokenApproval);

        // // Fail if transfer approvals do not go through
        // if (tokenApproval !== TransactionState.Sent) {
        //   return TransactionState.Failed;
        // }

        const options: SwapOptions = {
          slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
          deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
          recipient: address,
        };
        const methodParameters = SwapRouter.swapCallParameters(
          [trade],
          options
        );

        const tx = {
          data: methodParameters.calldata as `0x{string}`,
          to: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS,
          value: methodParameters.value,
          from: address,
          // maxFeePerGas: "250000",
          // maxPriorityFeePerGas: "250000",
          // gasLimit: "21000",
          // gasPrice: gasPrice.toString(),
        };
        const res = await sendTransaction(tx);
        return res;
      } catch (e) {
        console.log("callTokenSwap");
        console.log(e);
      }
    }
  }, [trade, address, UNISWAP_CONTRACT]);

  useEffect(() => {
    const fetchEstimatedGas = async () => {
      if (trade && inToken && address) {
        const options: SwapOptions = {
          slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
          deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
          recipient: address,
        };
        const methodParameters = SwapRouter.swapCallParameters(
          [trade],
          options
        );

        const tx = {
          data: methodParameters.calldata as `0x{string}`,
          to: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS,
          value: methodParameters.value,
          from: address,
          // maxFeePerGas: "250000",
          // maxPriorityFeePerGas: "250000",
          // gasLimit: "21000",
          // gasPrice: gasPrice.toString(),
        };

        const gas = await provider.estimateGas(tx);
        return setEstimatedGas(gas.toBigInt());
      }
    };
    fetchEstimatedGas().catch((e) => {
      console.log("**fetchEstimatedGasToSwap err**");
      console.log(e);
    });
  }, [trade, address, UNISWAP_CONTRACT]);

  return { amountOut, callTokenSwap, estimatedGas };
}