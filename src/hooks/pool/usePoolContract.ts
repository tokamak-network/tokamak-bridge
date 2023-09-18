import { BigNumber, ethers } from "ethers";
import {
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
import { useCallback, useState } from "react";
import useConnectedNetwork from "@/hooks/network";
import { useProvier } from "@/hooks/provider/useProvider";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { CurrencyAmount, Percent, Token } from "@uniswap/sdk-core";
import { fromReadableAmount } from "@/utils/uniswap/libs/converstion";
import { useAccount, useFeeData } from "wagmi";
import { sendTransaction } from "@/utils/uniswap/libs/provider";
import { useRecoilState, useRecoilValue } from "recoil";
import { lastFocusedInput, poolFeeStatus } from "@/recoil/pool/setPoolPosition";
import { L2_initCodeHashManualOverride } from "@/constant/contracts/uniswap";
import { usePool } from "./usePool";
import { useGetPool, useV3MintInfo } from "./useV3MintInfo";
import { getWETHAddress, isETH } from "@/utils/token/isETH";
import NONFUNGIBLE_POSITION_MANAGER_ABI from "@/abis/NONFUNGIBLE_POSITION_MANAGER_ABI.json";
import { Contract } from "ethers";
import { getProviderOrSigner } from "@/utils/web3/getEthersProviderOrSinger";
import { PoolState } from "@/types/pool/pool";
import { usePositionInfo } from "./useGetPositionIds";
import { ATOM_collectWethOption } from "@/recoil/pool/positions";
import { useGetMarketPrice } from "../price/useGetMarketPrice";
import { useTx } from "../tx/useTx";
import { Hash } from "viem";
import { transactionModalStatus } from "@/recoil/modal/atom";
import JSBI from "jsbi";
import { calculateGasLimit } from "../contracts/fee/calculateGasLimit";

export function usePoolMint() {
  const { inToken, outToken } = useInOutTokens();
  const { UNISWAP_CONTRACT } = useContract();
  const { provider } = useProvier();
  const { address } = useAccount();
  const feeAmount = useRecoilValue(poolFeeStatus);

  const [poolStatus, poolData] = usePool();
  const {
    ticks,
    poolForPosition,
    noLiquidity,
    dependentAmount,
    invertPrice,
    deposit0Disabled,
    deposit1Disabled,
  } = useV3MintInfo();
  const pool = poolStatus === PoolState.EXISTS ? poolData : poolForPosition;
  const lastFocused = useRecoilValue(lastFocusedInput);

  const [txHash, setTxHash] = useState<Hash | undefined>(undefined);
  const {} = useTx({ hash: txHash, txSort: "Add Liquidity" });
  const [, setModalOpen] = useRecoilState(transactionModalStatus);

  const mintPosition = useCallback(
    async (estimateGas?: boolean) => {
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

        const token0Input =
          lastFocused === "LeftInput"
            ? invertPrice
              ? outToken.amountBN
              : inToken.amountBN
            : invertPrice
            ? deposit1Disabled
              ? 0
              : outToken.amountBN
            : deposit0Disabled
            ? 0
            : dependentAmount?.quotient;

        const token1Input =
          lastFocused === "RightInput"
            ? invertPrice
              ? inToken.amountBN
              : outToken.amountBN
            : invertPrice
            ? deposit0Disabled
              ? 0
              : inToken.amountBN
            : deposit1Disabled
            ? 0
            : dependentAmount?.quotient;

        const token0 = CurrencyAmount.fromRawAmount(
          pool.token0,
          JSBI.BigInt(token0Input?.toString() ?? 0)
        );
        const token1 = CurrencyAmount.fromRawAmount(
          pool.token1,
          JSBI.BigInt(token1Input?.toString() ?? 0)
        );

        const positionToMint = Position.fromAmounts({
          pool: configuredPool,
          tickLower: ticks.LOWER,
          tickUpper: ticks.UPPER,
          amount0: token0.quotient,
          amount1: token1.quotient,
          useFullPrecision: true,
        });

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
          const inIsEth = invertPrice ? isETH(outToken) : isETH(inToken);
          const outIsETH = invertPrice ? isETH(inToken) : isETH(outToken);
          const inWeiAmount = ethers.BigNumber.from(token0.quotient.toString());
          const outWeiAmount = ethers.BigNumber.from(
            token1.quotient.toString()
          );
          const inHexAmount = ethers.utils.hexlify(inWeiAmount);
          const outHexAmount = ethers.utils.hexlify(outWeiAmount);

          //refundETH
          //it will return if All ETH won't be used to be deposit for some reasons like a price change
          const NonfungiblePositionManagerContract = new Contract(
            UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
            NONFUNGIBLE_POSITION_MANAGER_ABI,
            getProviderOrSigner(provider, address)
          );

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

          // Specify the function and parameters you want to call
          const functionName = "multicall"; // The function you want to call on the NFT Position Manager contract
          const functionParams = [multicallParam]; // Add your multicallParam here

          // Encode the function call data
          const functionData =
            NonfungiblePositionManagerContract.interface.encodeFunctionData(
              functionName,
              functionParams
            );

          // Calculate the total value based on your conditions
          const totalValue = inIsEth
            ? inHexAmount
            : outIsETH
            ? outHexAmount
            : value;

          // Create a TransactionRequest object
          const transactionRequest = {
            to: UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER, // NFT Position Manager contract address
            data: functionData, // Encoded function call data
            from: address, // Your Ethereum or Optimism address
            value: totalValue, // Convert totalValue to Ether
          };

          const gasLimit = await calculateGasLimit(
            provider,
            transactionRequest,
            true
          );

          try {
            const tx = estimateGas
              ? await NonfungiblePositionManagerContract.estimateGas.multicall(
                  multicallParam,
                  {
                    gasLimit,
                    value: inIsEth
                      ? inHexAmount
                      : outIsETH
                      ? outHexAmount
                      : value,
                    from: address,
                  }
                )
              : await NonfungiblePositionManagerContract.multicall(
                  multicallParam,
                  {
                    gasLimit,
                    value: inIsEth
                      ? inHexAmount
                      : outIsETH
                      ? outHexAmount
                      : value,
                    from: address,
                    gasPrice: BigNumber.from("1000000000"),
                  }
                );
            if (estimateGas) return tx;
            if (tx.hash) return setTxHash(tx.hash);
          } catch (e) {
            if (!estimateGas) {
              setModalOpen("error");
            }
          }
        }
      }
    },
    [
      provider,
      inToken,
      outToken,
      address,
      UNISWAP_CONTRACT,
      pool,
      ticks,
      invertPrice,
      feeAmount,
      noLiquidity,
      lastFocused,
      dependentAmount,
      deposit0Disabled,
      deposit1Disabled,
    ]
  );

  const { data: feeData } = useFeeData();
  const { tokenMarketPrice: ethPrice } = useGetMarketPrice({
    tokenName: "ethereum",
  });

  const estimateGasToMint = useCallback(async () => {
    if (feeData && ethPrice) {
      const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = feeData;
      const estimatedGasUsage = await mintPosition(true);

      if (estimatedGasUsage === undefined) return undefined;

      const totalGasCost =
        Number(gasPrice) * Number(estimatedGasUsage.toString());
      const parsedTotalGasCost = ethers.utils.formatUnits(
        totalGasCost.toString(),
        "ether"
      );

      const totalGasCostUSD =
        Number(parsedTotalGasCost.replaceAll(",", "")) * ethPrice;

      return totalGasCostUSD;
    }
  }, [feeData, ethPrice, mintPosition]);

  return { mintPosition, estimateGasToMint };
}

export function usePoolContract() {
  const { mode } = useGetMode();
  const { inToken, outToken } = useInOutTokens();
  const { UNISWAP_CONTRACT } = useContract();
  const { layer, chainName } = useConnectedNetwork();
  const { provider } = useProvier();
  const { address } = useAccount();
  const feeAmount = useRecoilValue(poolFeeStatus);
  const [txHash, setTxHash] = useState<Hash | undefined>(undefined);

  const {} = useTx({ hash: txHash, txSort: "Increase Liquidity" });
  const [, setModalOpen] = useRecoilState(transactionModalStatus);

  const getPoolInfo = useCallback(
    async (tokenA?: Token, tokenB?: Token) => {
      if (inToken && outToken && feeAmount) {
        const currentPoolAddress = computePoolAddress({
          factoryAddress: UNISWAP_CONTRACT.POOL_FACTORY_CONTRACT_ADDRESS,
          tokenA: tokenA ?? inToken.token,
          tokenB: tokenB ?? outToken.token,
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
    },
    [mode, inToken, outToken, feeAmount]
  );

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

  const { info } = usePositionInfo();

  const increaseLiquidity = useCallback(
    async (estimatedGas?: boolean) => {
      if (address && info && (inToken || outToken)) {
        const {
          token0,
          token1,
          rawPositionInfo,
          tickCurrent,
          tickLower,
          tickUpper,
          sqrtPriceX96,
          id,
        } = info;
        const { fee, liquidity } = rawPositionInfo;

        const token0Amount = CurrencyAmount.fromRawAmount(
          token0,
          inToken?.amountBN?.toString() ?? "0"
        );
        const token1Amount = CurrencyAmount.fromRawAmount(
          token1,
          outToken?.amountBN?.toString() ?? "9"
        );

        const configuredPool = new Pool(
          token0,
          token1,
          fee,
          sqrtPriceX96,
          liquidity.toString(),
          tickCurrent
        );

        const positionToIncreaseBy = Position.fromAmounts({
          pool: configuredPool,
          tickLower,
          tickUpper,
          amount0: token0Amount.quotient,
          amount1: token1Amount.quotient,
          useFullPrecision: true,
        });

        const addLiquidityOptions: AddLiquidityOptions = {
          deadline: Math.floor(Date.now() / 1000) + 60 * 20,
          slippageTolerance: new Percent(50, 10_000),
          tokenId: id,
        };
        if (positionToIncreaseBy) {
          const { calldata, value } =
            NonfungiblePositionManager.addCallParameters(
              positionToIncreaseBy,
              addLiquidityOptions
            );

          //for ETH value
          const inIsEth = isETH(inToken);
          const outIsETH = isETH(outToken);
          const inWeiAmount = ethers.BigNumber.from(
            token0Amount.quotient.toString()
          );
          const outWeiAmount = ethers.BigNumber.from(
            token1Amount.quotient.toString()
          );
          const inHexAmount = ethers.utils.hexlify(inWeiAmount);
          const outHexAmount = ethers.utils.hexlify(outWeiAmount);

          //refundETH
          //it will return if All ETH won't be used to be deposit for some reasons like a price change
          const NonfungiblePositionManagerContract = new Contract(
            UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
            NONFUNGIBLE_POSITION_MANAGER_ABI,
            getProviderOrSigner(provider, address)
          );

          const refundETHData =
            NonfungiblePositionManagerContract.interface.encodeFunctionData(
              "refundETH"
            );

          const multicallParam =
            inIsEth || outIsETH ? [calldata, refundETHData] : [calldata];
          const estimatedGasUsage =
            await NonfungiblePositionManagerContract.estimateGas.multicall(
              multicallParam,
              {
                value: inIsEth ? inHexAmount : outIsETH ? outHexAmount : value,
                from: address,
              }
            );
          if (estimatedGas) {
            return estimatedGasUsage;
          }
          try {
            const tx = await NonfungiblePositionManagerContract.multicall(
              multicallParam,
              {
                gasLimit: 3000000,
                value: inIsEth ? inHexAmount : outIsETH ? outHexAmount : value,
                from: address,
              }
            );

            if (tx.hash) return setTxHash(tx.hash);
          } catch (e) {
            setModalOpen("error");
          }

          // build transaction
          // const transaction = {
          //   data: [calldata, refundETHData],
          //   to: UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
          //   value: value,
          //   from: address,
          // };
          // return sendTransaction(transaction);
        }
      }
    },
    [provider, inToken, outToken, address, UNISWAP_CONTRACT]
  );

  const [, poolData] = usePool(info?.token0, info?.token1, info?.fee);
  const [txHashToRemoveLiquidity, setTxHashToRemoveLiquidity] = useState<
    Hash | undefined
  >(undefined);
  const {} = useTx({
    hash: txHashToRemoveLiquidity,
    txSort: "Remove Liquidity",
  });

  const removeLiquidity = useCallback(
    async (
      positionId: number | undefined,
      removeLiquidityPercentage: number | undefined,
      estimateGas?: boolean
    ) => {
      console.log("--removeLiquidity--");
      console.log(info, address, positionId, removeLiquidityPercentage);

      try {
        if (
          info &&
          address &&
          positionId &&
          removeLiquidityPercentage &&
          poolData
        ) {
          const {
            token0,
            token1,
            rawPositionInfo,
            tickCurrent,
            tickLower,
            tickUpper,
            // sqrtPriceX96,
          } = info;
          const { fee, liquidity, sqrtPriceX96 } = rawPositionInfo;

          const configuredPool = new Pool(
            token0,
            token1,
            fee,
            sqrtPriceX96,
            liquidity,
            tickCurrent
          );

          const currentPosition = new Position({
            pool: configuredPool,
            tickLower,
            tickUpper,
            liquidity: liquidity.toString(),
          });

          const collectOptions: Omit<CollectOptions, "tokenId"> = {
            expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(token0, 0),
            expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(token1, 0),
            recipient: address,
          };

          const removeLiquidityOptions: RemoveLiquidityOptions = {
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
            slippageTolerance: new Percent(50, 10_000),
            tokenId: positionId,
            // percentage of liquidity to remove
            liquidityPercentage: new Percent(removeLiquidityPercentage, 100),
            collectOptions,
          };

          if (currentPosition) {
            const { calldata, value } =
              NonfungiblePositionManager.removeCallParameters(
                currentPosition,
                removeLiquidityOptions
              );
            const NonfungiblePositionManagerContract = new Contract(
              UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
              NONFUNGIBLE_POSITION_MANAGER_ABI,
              getProviderOrSigner(provider, address)
            );

            const tx = estimateGas
              ? await NonfungiblePositionManagerContract.estimateGas.multicall(
                  [calldata],
                  {
                    gasLimit: 3000000,
                    value,
                    from: address,
                  }
                )
              : await NonfungiblePositionManagerContract.multicall([calldata], {
                  gasLimit: 3000000,
                  value,
                  from: address,
                });

            if (estimateGas) return tx;
            if (tx.hash) return setTxHashToRemoveLiquidity(tx.hash);
          }
        }
      } catch (e) {
        console.log(e);
        if (!estimateGas) {
          setModalOpen("error");
        }
      }
    },
    [provider, info, address, UNISWAP_CONTRACT, poolData]
  );

  const collectAsWETH = useRecoilValue(ATOM_collectWethOption);
  const [txHashToCollect, setTxHashToCollect] = useState<Hash | undefined>(
    undefined
  );
  const {} = useTx({
    hash: txHashToCollect,
    txSort: "Collect Fee",
  });

  const collectFees = useCallback(
    async (estimateGas?: boolean) => {
      // console.log("--collectFees--");
      // console.log(info, address);
      if (info && address && provider && chainName) {
        const token0 = info.token0;
        const token1 = info.token1;

        const collectOptions: CollectOptions = {
          tokenId: info.id,
          expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(
            token0,
            fromReadableAmount(
              Number(info.token0CollectedFee),
              token0.decimals
            ).toString()
          ),
          expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(
            token1,
            fromReadableAmount(
              Number(info.token1CollectedFee),
              token1.decimals
            ).toString()
          ),
          recipient: address,
        };

        const NonfungiblePositionManagerContract = new Contract(
          UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
          NONFUNGIBLE_POSITION_MANAGER_ABI,
          getProviderOrSigner(provider, address)
        );

        if (info.hasETH && collectAsWETH === false) {
          console.log("collect as ETH");

          const collectData =
            NonfungiblePositionManagerContract.interface.encodeFunctionData(
              "collect",
              [
                {
                  tokenId: info.id,
                  recipient: "0x0000000000000000000000000000000000000000",
                  amount0Max: ethers.BigNumber.from(2).pow(128).sub(1),
                  amount1Max: ethers.BigNumber.from(2).pow(128).sub(1),
                },
              ]
            );
          const amountMinimum = 0;
          const unwrapWETH9 =
            NonfungiblePositionManagerContract.interface.encodeFunctionData(
              "unwrapWETH9",
              [amountMinimum, address]
            );

          const WETH_ADDRESS = getWETHAddress(chainName);
          const token0IsNative =
            WETH_ADDRESS.toLowerCase() === token0.address.toLowerCase();
          const sweepTokenAddress = token0IsNative
            ? token1.address
            : token0.address;

          const sweepToken =
            NonfungiblePositionManagerContract.interface.encodeFunctionData(
              "sweepToken",
              [sweepTokenAddress, amountMinimum, address]
            );
          try {
            const tx = estimateGas
              ? await NonfungiblePositionManagerContract.estimateGas.multicall(
                  [collectData, unwrapWETH9, sweepToken],
                  {
                    gasLimit: 3000000,
                  }
                )
              : await NonfungiblePositionManagerContract.multicall(
                  [collectData, unwrapWETH9, sweepToken],
                  {
                    gasLimit: 3000000,
                  }
                );
            if (estimateGas) return tx;
            if (tx.hash) return setTxHashToCollect(tx.hash);
          } catch (e) {
            if (!estimateGas) {
              setModalOpen("error");
            }
          }
        }

        //collect as WETH
        try {
          const { calldata, value } =
            NonfungiblePositionManager.collectCallParameters(collectOptions);
          const estimatedGasAmount =
            await NonfungiblePositionManagerContract.estimateGas.multicall([
              calldata,
            ]);
          if (estimateGas) {
            return estimatedGasAmount;
          }
          const tx = await NonfungiblePositionManagerContract.multicall(
            [calldata],
            {
              gasLimit: 3000000,
            }
          );
          if (tx.hash) return setTxHashToCollect(tx.hash);
        } catch (e) {
          setModalOpen("error");
        }
      }
    },
    [
      provider,
      address,
      UNISWAP_CONTRACT,
      info,
      collectAsWETH,
      provider,
      chainName,
    ]
  );

  const { data: feeData } = useFeeData();
  const { tokenMarketPrice: ethPrice } = useGetMarketPrice({
    tokenName: "ethereum",
  });

  const estimateGasToIncrease = useCallback(async () => {
    if (feeData && ethPrice) {
      const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = feeData;
      const estimatedGasUsage = await increaseLiquidity(true);
      if (estimatedGasUsage) {
        const totalGasCost =
          Number(gasPrice) * Number(estimatedGasUsage.toString());
        const parsedTotalGasCost = ethers.utils.formatUnits(
          totalGasCost.toString(),
          "ether"
        );

        const totalGasCostUSD =
          Number(parsedTotalGasCost.replaceAll(",", "")) * ethPrice;

        return totalGasCostUSD;
      }
    }
  }, [feeData, ethPrice]);

  const estimateGasToCollect = useCallback(async () => {
    if (feeData && ethPrice) {
      const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = feeData;
      const estimatedGasUsage = await collectFees(true);
      const totalGasCost =
        Number(gasPrice) * Number(estimatedGasUsage.toString());
      const parsedTotalGasCost = ethers.utils.formatUnits(
        totalGasCost.toString(),
        "ether"
      );

      const totalGasCostUSD =
        Number(parsedTotalGasCost.replaceAll(",", "")) * ethPrice;

      return totalGasCostUSD;
    }
  }, [feeData, ethPrice]);

  const estimateGasToRemove = useCallback(
    async (
      positionId: number | undefined,
      removeLiquidityPercentage: number | undefined
    ) => {
      if (feeData && ethPrice) {
        const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = feeData;
        const estimatedGasUsage = await removeLiquidity(
          positionId,
          removeLiquidityPercentage,
          true
        );
        const totalGasCost =
          Number(gasPrice) * Number(estimatedGasUsage.toString());
        const parsedTotalGasCost = ethers.utils.formatUnits(
          totalGasCost.toString(),
          "ether"
        );

        const totalGasCostUSD =
          Number(parsedTotalGasCost.replaceAll(",", "")) * ethPrice;

        return totalGasCostUSD;
      }
    },
    [feeData, ethPrice]
  );

  return {
    increaseLiquidity,
    removeLiquidity,
    collectFees,
    estimateGasToIncrease,
    estimateGasToCollect,
    estimateGasToRemove,
  };
}
