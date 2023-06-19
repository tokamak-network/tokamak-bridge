import { ethers } from "ethers";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import Swap from "@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json";
import { useProvier } from "../provider/useProvider";
import { useCallback, useEffect, useState, useMemo } from "react";
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
import SwapperV2ABI from "@/abis/SwapperV2.json";
import {
  fromReadableAmount,
  toReadableAmount,
} from "@/utils/uniswap/libs/converstion";
import { useInOutTokens } from "../token/useInOutTokens";
import { sendTransaction } from "@/utils/uniswap/libs/provider";
import useConnectedNetwork from "../network";
import { useGetMode } from "../mode/useGetMode";
import useContract from "@/hooks/contracts/useContract";
import { useRecoilState } from "recoil";
import { transactionModalStatus } from "@/recoil/modal/atom";
import { TokenInfo, supportedTokens } from "@/types/token/supportedToken";

import {
  useAccount,
  useBlockNumber,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
} from "wagmi";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { supportedChain } from "@/types/network/supportedNetwork";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";

export type TokenTrade = Trade<Token, Token, TradeType>;

export function useSwapTokens() {}

export function useAmountOut() {
  const { provider } = useProvier();
  const { address } = useAccount();
  const { mode } = useGetMode();

  const { inToken, outToken } = useInOutTokens();
  const { UNISWAP_CONTRACT, SWAPPER_V2_CONTRACT } = useContract();
  const { layer } = useConnectedNetwork();

  const [amountOut, setAmountOut] = useState<string | null>(null);
  const [trade, setTrade] = useState<TokenTrade | null>(null);
  const [estimatedGas, setEstimatedGas] = useState<bigint | undefined>(
    undefined
  );
  const [amountOutErr, setAmountOutErr] = useState<boolean>(false);
  const { chain } = useNetwork();

  const { QUOTER_CONTRACT } = useUniswapContracts();
  const { data, write: tonWton } = useContractWrite({
    address: SWAPPER_V2_CONTRACT as `0x${string}`,
    abi: SwapperV2ABI.abi,
    functionName: "tonToWton",
  });

  const { isLoading: tonWtonLoading, isSuccess: tonWtonSuccess } =
    useWaitForTransaction({
      hash: data?.hash,
    });

  const { write: wtonTon } = useContractWrite({
    address: SWAPPER_V2_CONTRACT as `0x${string}`,
    abi: SwapperV2ABI.abi,
    functionName: "wtonToTon",
  });

  const { isLoading: wtonTonLoading, isSuccess: wtonTonSuccess } =
    useWaitForTransaction({
      hash: data?.hash,
    });
  // const { write } = useContractWrite({
  //   address: L1_UniswapContracts.SWAP_ROUTER_ADDRESS,
  //   abi: IUniswapV3PoolABI.abi,
  // });

  const [modalOpen, setModalOpen] = useRecoilState(transactionModalStatus);

  const chainInfo = useMemo(() => {
    if (chain?.id) {
      const chainName = getKeyByValue(SupportedChainId, chain.id);
      return  chainName;
    }
  }, [chain]);

  useEffect(() => {
    const getAmountOut = async () => {
      if (
        mode === "Swap" &&
        inToken &&
        inToken?.amountBN !== null &&
        outToken?.address
      ) {
        if (
          (inToken.tokenSymbol === "TON" && outToken.tokenSymbol === "WTON") ||
          (inToken.tokenSymbol === "WTON" && outToken.tokenSymbol === "TON")
        ) {
          return setAmountOut(inToken.parsedAmount);
        } else {
          const quotedAmountOut =
            await QUOTER_CONTRACT.callStatic.quoteExactInputSingle(
              inToken.token.address,
              outToken.token.address,
              FeeAmount.MEDIUM,
              inToken.amountBN,
              // fromReadableAmount(
              //   Number(inToken.parsedAmount),
              //   inToken.decimals
              // ).toString(),
              0
            );

          setAmountOutErr(false);
          return setAmountOut(
            toReadableAmount(quotedAmountOut, outToken.decimals)
          );
        }
      }
      setAmountOutErr(false);
      return setAmountOut(null);
    };

    getAmountOut().catch((e) => {
      console.log("**getAmountOut err**");
      console.log(e);
      setAmountOutErr(true);
    });
  }, [inToken, outToken, QUOTER_CONTRACT]);

  useEffect(() => {
    const createTrade = async () => {
      if (
        mode === "Swap" &&
        inToken &&
        inToken?.amountBN !== null &&
        outToken &&
        amountOut
      ) {
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

        // const uncheckedTrade = await Trade.exactIn(swapRoute,CurrencyAmount.fromRawAmount(
        //   inToken.token,
        //   fromReadableAmount(
        //     Number(inToken.parsedAmount),
        //     inToken.decimals
        //   ).toString()
        // ))

        return setTrade(uncheckedTrade);
      }
      return setTrade(null);
    };
    createTrade().catch((e) => {
      console.log("**createTrade err**");
      console.log(e);
    });
  }, [inToken, outToken, amountOut, UNISWAP_CONTRACT, layer, mode]);

  const callTokenSwap = useCallback(async () => {
    console.log("supportedTokens", supportedTokens);
    if (trade && inToken && address && inToken.parsedAmount) {
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
        const wei = ethers.utils.parseUnits(inToken.parsedAmount, "18");
        const weiAmount = ethers.BigNumber.from(wei);
        const hexAmount = ethers.utils.hexlify(weiAmount);

        const tx = {
          data: methodParameters.calldata as `0x{string}`,
          to: UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS,
          value:
            inToken.tokenAddress ===
            supportedTokens[0].address[chainInfo || "MAINNET"]
              ? hexAmount
              : methodParameters.value,
          from: address,
          // maxFeePerGas: "250000",
          // maxPriorityFeePerGas: "250000",
          // gasLimit: "21000",
          // gasPrice: gasPrice.toString(),
        };
        if (tx) {
          setModalOpen("confirming");
          const res = await sendTransaction(tx);
          if (res === "Sent") {
            return setModalOpen("confirmed");
          }
          if (res === "Rejected") {
            return setModalOpen("error");
          }
        }
      } catch (e) {
        console.log("callTokenSwap");
        console.log(e);
        setModalOpen("error");
      }
    } else if (
      trade === null &&
      ((inToken?.tokenAddress ===
        supportedTokens[1].address[chainInfo || "MAINNET" ] &&
        outToken?.tokenAddress ===
          supportedTokens[2].address[chainInfo || "MAINNET"]) ||
        (inToken?.tokenAddress ===
          supportedTokens[2].address[chainInfo || "MAINNET" ] &&
          outToken?.tokenAddress ===
            supportedTokens[1].address[chainInfo || "MAINNET"])) &&
      inToken &&
      address &&
      inToken.parsedAmount
    ) {
      try {
        let amountIn;
        if (inToken.tokenSymbol === "TON") {
          amountIn = ethers.utils.parseEther(inToken.parsedAmount);
          tonWton({
            args: [amountIn],
          });
        } else {
          amountIn = ethers.utils.parseUnits(inToken.parsedAmount, "27");

          wtonTon({
            args: [amountIn],
          });
        }

        if (tonWtonLoading || wtonTonLoading) {
          setModalOpen("confirming");
        }
      } catch (e) {
        console.log("**swap err*");
        console.log(e);
      }
    }
  }, [trade, address, UNISWAP_CONTRACT]);

  useEffect(() => {
    const fetchEstimatedGas = async () => {
      if (mode === "Swap" && trade && address) {
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
    // fetchEstimatedGas().catch((e) => {
    //   console.log("**fetchEstimatedGasToSwap err**");
    //   console.log(e);
    // });
  }, [trade, UNISWAP_CONTRACT, mode]);

  return { amountOut, callTokenSwap, estimatedGas, amountOutErr };
}
