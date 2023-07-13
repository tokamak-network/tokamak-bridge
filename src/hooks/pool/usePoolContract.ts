import { ethers } from "ethers";
import {
  FeeAmount,
  computePoolAddress,
  MintOptions,
  nearestUsableTick,
  NonfungiblePositionManager,
  Pool,
  Position,
  AddLiquidityOptions,
  CollectOptions,
  RemoveLiquidityOptions,
} from "@uniswap/v3-sdk";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useContract from "@/hooks/contracts/useContract";
import { useCallback, useEffect } from "react";
import useConnectedNetwork from "@/hooks/network";
import { useProvier } from "@/hooks/provider/useProvider";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { CurrencyAmount, Percent, Token } from "@uniswap/sdk-core";
import { fromReadableAmount } from "@/utils/uniswap/libs/converstion";
import { useAccount } from "wagmi";
import { sendTransaction } from "@/utils/uniswap/libs/provider";
import { useRecoilValue } from "recoil";
import { poolFeeStatus } from "@/recoil/pool/setPoolPosition";
import { L2_initCodeHashManualOverride } from "@/constant/contracts/uniswap";
import { usePool } from "./usePool";
import { useV3MintInfo } from "./useV3MintInfo";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { isETH } from "@/utils/token/isETH";
import NONFUNGIBLE_POSITION_MANAGER_ABI from "@/abis/NONFUNGIBLE_POSITION_MANAGER_ABI.json";
import { Contract } from "ethers";
import { getProviderOrSigner } from "@/utils/web3/getEthersProviderOrSinger";
import { PoolState } from "@/types/pool/pool";
import { useGetAmountForLiquidity } from "./useGetAmountForLiquidity";

export function usePoolMint() {
  const { inToken, outToken } = useInOutTokens();
  const { UNISWAP_CONTRACT } = useContract();
  const { provider } = useProvier();
  const { address } = useAccount();
  const feeAmount = useRecoilValue(poolFeeStatus);

  const [poolStatus, poolData] = usePool();
  const { ticks, poolForPosition, noLiquidity } = useV3MintInfo();
  const pool = poolStatus === PoolState.EXISTS ? poolData : poolForPosition;
  const { invertAmount } = useGetAmountForLiquidity();

  const mintPosition = useCallback(async () => {
    if (
      pool &&
      inToken &&
      outToken &&
      address &&
      ticks.LOWER &&
      ticks.UPPER &&
      feeAmount
    ) {
      const configuredPool = new Pool(
        pool.token0,
        pool.token1,
        pool.fee,
        pool.sqrtRatioX96.toString(),
        pool.liquidity.toString(),
        pool.tickCurrent
      );

      const token0 = CurrencyAmount.fromRawAmount(
        pool.token0,
        fromReadableAmount(
          Number(invertAmount ? outToken.parsedAmount : inToken.parsedAmount),
          pool.token0.decimals
        ).toString()
      );
      const token1 = CurrencyAmount.fromRawAmount(
        pool.token1,
        fromReadableAmount(
          Number(invertAmount ? inToken.parsedAmount : outToken.parsedAmount),
          pool.token1.decimals
        ).toString()
      );

      const positionToMint = Position.fromAmounts({
        pool: configuredPool,
        tickLower: ticks.LOWER,
        tickUpper: ticks.UPPER,
        amount0: token0.quotient,
        amount1: token1.quotient,
        useFullPrecision: true,
      });

      console.log("positionToMint");
      console.log(positionToMint);

      if (positionToMint) {
        const mintOptions: MintOptions = {
          recipient: address,
          deadline: Math.floor(Date.now() / 1000) + 60 * 20,
          slippageTolerance: new Percent(50, 10_000),
        };

        // get calldata for minting a position
        const { calldata, value } =
          NonfungiblePositionManager.addCallParameters(
            positionToMint,
            mintOptions
          );

        //for ETH value
        const inIsEth = isETH(inToken);
        const outIsETH = isETH(outToken);
        const inWeiAmount = ethers.BigNumber.from(token0.quotient.toString());
        const outWeiAmount = ethers.BigNumber.from(token1.quotient.toString());
        const inHexAmount = ethers.utils.hexlify(inWeiAmount);
        const outHexAmount = ethers.utils.hexlify(outWeiAmount);

        //refundETH
        //it will return if All ETH won't be used to be deposit for some reasons like a price change
        const NonfungiblePositionManagerContract = new Contract(
          UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
          NONFUNGIBLE_POSITION_MANAGER_ABI,
          getProviderOrSigner(provider, address)
        );

        console.log("configuredPool");
        console.log(configuredPool);

        const initializePool =
          NonfungiblePositionManagerContract.interface.encodeFunctionData(
            "createAndInitializePoolIfNecessary",
            [
              token0.currency.address,
              token1.currency.address,
              feeAmount,
              configuredPool.sqrtRatioX96.toString(),
            ]
          );

        const refundETHData =
          NonfungiblePositionManagerContract.interface.encodeFunctionData(
            "refundETH"
          );

        const multicallParam =
          noLiquidity && (inIsEth || outIsETH)
            ? [initializePool, calldata, refundETHData]
            : noLiquidity
            ? [initializePool, calldata]
            : inIsEth || outIsETH
            ? [calldata, refundETHData]
            : [calldata];

        const tx = await NonfungiblePositionManagerContract.multicall(
          multicallParam,
          {
            // gasLimit: 3000000,
            value: inIsEth ? inHexAmount : outIsETH ? outHexAmount : value,
            from: address,
          }
        );

        // sendTransaction(tx);

        // build transaction
        // const transaction = {
        //   data: calldata,
        //   to: UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
        //   value: inIsEth ? inHexAmount : outIsETH ? outHexAmount : value,
        //   from: address,
        // };
        // return sendTransaction(transaction);
      }
    }
  }, [
    provider,
    inToken,
    outToken,
    address,
    UNISWAP_CONTRACT,
    pool,
    ticks,
    invertAmount,
    feeAmount,
    noLiquidity,
  ]);

  return { mintPosition };
}

export function usePoolContract() {
  const { mode } = useGetMode();
  const { inToken, outToken } = useInOutTokens();
  const { UNISWAP_CONTRACT } = useContract();
  const { layer } = useConnectedNetwork();
  const { provider } = useProvier();
  const { address } = useAccount();
  const feeAmount = useRecoilValue(poolFeeStatus);

  const getPoolInfo = useCallback(async () => {
    if (inToken && outToken && feeAmount) {
      const currentPoolAddress = computePoolAddress({
        factoryAddress: UNISWAP_CONTRACT.POOL_FACTORY_CONTRACT_ADDRESS,
        tokenA: inToken.token,
        tokenB: outToken.token,
        fee: feeAmount,
        initCodeHashManualOverride:
          layer === "L2" ? L2_initCodeHashManualOverride : undefined,
      });

      const POOL_CONTRACT = new ethers.Contract(
        currentPoolAddress,
        IUniswapV3PoolABI.abi,
        provider
      );

      const [token0, token1, fee, tickSpacing, liquidity, slot0] =
        await Promise.all([
          POOL_CONTRACT.token0(),
          POOL_CONTRACT.token1(),
          POOL_CONTRACT.fee(),
          POOL_CONTRACT.tickSpacing(),
          POOL_CONTRACT.liquidity(),
          POOL_CONTRACT.slot0(),
        ]);

      return {
        token0,
        token1,
        fee,
        tickSpacing,
        liquidity,
        sqrtPriceX96: slot0[0],
        tick: slot0[1],
      };
    }
  }, [mode, inToken, outToken, feeAmount]);

  const constructPosition = useCallback(
    async (
      token0Amount: CurrencyAmount<Token>,
      token1Amount: CurrencyAmount<Token>
    ): Promise<Position | undefined> => {
      // get pool info
      const poolInfo = await getPoolInfo();

      if (poolInfo) {
        // construct pool instance
        const configuredPool = new Pool(
          token0Amount.currency,
          token1Amount.currency,
          poolInfo.fee,
          poolInfo.sqrtPriceX96.toString(),
          poolInfo.liquidity.toString(),
          poolInfo.tick
        );

        // create position using the maximum liquidity from input amounts
        return Position.fromAmounts({
          pool: configuredPool,
          tickLower:
            nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) -
            poolInfo.tickSpacing * 2,
          tickUpper:
            nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) +
            poolInfo.tickSpacing * 2,
          amount0: token0Amount.quotient,
          amount1: token1Amount.quotient,
          useFullPrecision: true,
        });
      }
      return undefined;
    },
    []
  );

  const addLiquidity = useCallback(
    async (positionId: number) => {
      if (inToken && outToken && address) {
        const positionToIncreaseBy = await constructPosition(
          CurrencyAmount.fromRawAmount(
            inToken.token,
            fromReadableAmount(
              Number(inToken.parsedAmount),
              inToken.decimals
            ).toString()
          ),
          CurrencyAmount.fromRawAmount(
            outToken.token,
            fromReadableAmount(
              Number(outToken.parsedAmount),
              outToken.decimals
            ).toString()
          )
        );
        const addLiquidityOptions: AddLiquidityOptions = {
          deadline: Math.floor(Date.now() / 1000) + 60 * 20,
          slippageTolerance: new Percent(50, 10_000),
          tokenId: positionId,
        };
        if (positionToIncreaseBy) {
          const { calldata, value } =
            NonfungiblePositionManager.addCallParameters(
              positionToIncreaseBy,
              addLiquidityOptions
            );

          // build transaction
          const transaction = {
            data: calldata,
            to: UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
            value: value,
            from: address,
          };
          return sendTransaction(transaction);
        }
      }
    },
    [provider, inToken, outToken, address, UNISWAP_CONTRACT]
  );

  const removeLiquidity = useCallback(
    async (positionId: number, removeLiquidityPercentage: number) => {
      console.log("--removeLiquidity--");
      console.log(inToken, outToken, address);
      if (inToken && outToken && address) {
        const currentPosition = await constructPosition(
          CurrencyAmount.fromRawAmount(
            inToken.token,
            fromReadableAmount(
              Number(inToken.parsedAmount),
              inToken.decimals
            ).toString()
          ),
          CurrencyAmount.fromRawAmount(
            outToken.token,
            fromReadableAmount(
              Number(outToken.parsedAmount),
              outToken.decimals
            ).toString()
          )
        );
        const collectOptions: Omit<CollectOptions, "tokenId"> = {
          expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(inToken.token, 0),
          expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(
            outToken.token,
            0
          ),
          recipient: address,
        };

        const removeLiquidityOptions: RemoveLiquidityOptions = {
          deadline: Math.floor(Date.now() / 1000) + 60 * 20,
          slippageTolerance: new Percent(50, 10_000),
          tokenId: positionId,
          // percentage of liquidity to remove
          liquidityPercentage: new Percent(removeLiquidityPercentage),
          collectOptions,
        };
        if (currentPosition) {
          // get calldata for minting a position
          const { calldata, value } =
            NonfungiblePositionManager.removeCallParameters(
              currentPosition,
              removeLiquidityOptions
            );

          // build transaction
          const transaction = {
            data: calldata,
            to: UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
            value: value,
            from: address,
          };

          return sendTransaction(transaction);
        }
      }
    },
    [provider, inToken, outToken, address, UNISWAP_CONTRACT]
  );

  const collectFees = useCallback(
    async (positionId: number) => {
      console.log("--collectFees--");
      console.log(inToken, outToken, address);
      if (inToken && outToken && address) {
        const collectOptions: CollectOptions = {
          tokenId: positionId,
          expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(
            inToken.token,
            fromReadableAmount(
              Number(inToken.parsedAmount),
              inToken.decimals
            ).toString()
          ),
          expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(
            outToken.token,
            fromReadableAmount(
              Number(outToken.parsedAmount),
              outToken.decimals
            ).toString()
          ),
          recipient: address,
        };
        // get calldata for minting a position
        const { calldata, value } =
          NonfungiblePositionManager.collectCallParameters(collectOptions);

        // build transaction
        const transaction = {
          data: calldata,
          to: UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
          value: value,
          from: address,
        };

        return sendTransaction(transaction);
      }
    },
    [provider, inToken, outToken, address, UNISWAP_CONTRACT]
  );

  return { addLiquidity, removeLiquidity, collectFees };
}
