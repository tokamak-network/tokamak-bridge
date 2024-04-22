import { ethers } from "ethers";
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
import { BigintIsh, CurrencyAmount, Percent, Token } from "@uniswap/sdk-core";
import { useAccount, useFeeData } from "wagmi";
import { useRecoilState, useRecoilValue } from "recoil";
import { lastFocusedInput, poolFeeStatus } from "@/recoil/pool/setPoolPosition";
import { L2_initCodeHashManualOverride } from "@/constant/contracts/uniswap";
import { usePool } from "./usePool";
import { useV3MintInfo } from "./useV3MintInfo";
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
import { uniswapTxSetting } from "@/recoil/uniswap/setting";
import { encodeMulticall } from "@/utils/contract/encodeMulticall";
import { useIncreaseAmount } from "./useIncreaseAmount";
import {
  calculateGasMargin,
  getSingleCalldataGasLimit,
} from "@/utils/txn/calculateGasMargin";
import { useSettingValue } from "../uniswap/useSettingValue";

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
  const {} = useTx({
    hash: txHash,
    txSort: "Add Liquidity",
    tokenAddress: invertPrice
      ? (outToken?.token.address as Hash | undefined)
      : (inToken?.token.address as Hash | undefined),
    tokenOutAddress: invertPrice
      ? (inToken?.token.address as Hash | undefined)
      : (outToken?.token.address as Hash | undefined),
  });
  const [, setModalOpen] = useRecoilState(transactionModalStatus);
  const { layer, isConnectedToMainNetwork } = useConnectedNetwork();
  const { token0Input, token1Input } = useIncreaseAmount();
  const settingValues = useSettingValue();

  const mintPosition = useCallback(
    async (estimateGas?: boolean) => {
      if (
        pool &&
        inToken &&
        outToken &&
        address &&
        ticks.LOWER &&
        ticks.UPPER &&
        feeAmount &&
        provider &&
        UNISWAP_CONTRACT
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
            deadline: settingValues.deadlineBySeconds,
            slippageTolerance: settingValues.slippage,
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

          // Calculate the total value based on your conditions
          const totalValue = inIsEth
            ? inHexAmount
            : outIsETH
            ? outHexAmount
            : value;

          const txData = {
            to: UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
            from: address,
            value: totalValue,
          };

          // Create a TransactionRequest object
          const transactionRequest = encodeMulticall({
            ...txData,
            contract: NonfungiblePositionManagerContract,
            multicallParam,
          });

          const isLayer2 = Boolean(layer === "L2");

          const gasLimit =
            multicallParam.length === 1
              ? await getSingleCalldataGasLimit(provider, txData, calldata)
              : await calculateGasLimit(
                  provider,
                  transactionRequest,
                  isLayer2,
                  isConnectedToMainNetwork
                );

          if (estimateGas) return gasLimit;

          try {
            if (multicallParam.length === 1 && gasLimit) {
              const tx = await provider.getSigner().sendTransaction({
                ...txData,
                data: calldata,
                gasLimit,
              });
              if (tx.hash) return setTxHash(tx.hash as Hash);
              return;
            }

            if (gasLimit) {
              const tx = await NonfungiblePositionManagerContract.multicall(
                multicallParam,
                {
                  gasLimit,
                  value: inIsEth
                    ? inHexAmount
                    : outIsETH
                    ? outHexAmount
                    : value,
                  from: address,
                  // gasPrice: isLayer2 ? BigNumber.from("1000000000") : null,
                }
              );
              if (tx.hash) return setTxHash(tx.hash);
              return;
            }
          } catch (e) {
            console.log(e);
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
      layer,
      isConnectedToMainNetwork,
      token0Input,
      token1Input,
      settingValues,
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
  const { inToken, outToken } = useInOutTokens();
  const { UNISWAP_CONTRACT } = useContract();
  const { layer, chainName, isConnectedToMainNetwork } = useConnectedNetwork();
  const { provider } = useProvier();
  const { address } = useAccount();
  const [txHash, setTxHash] = useState<Hash | undefined>(undefined);

  const {} = useTx({
    hash: txHash,
    txSort: "Increase Liquidity",
    tokenAddress: inToken?.token.address as Hash | undefined,
    tokenOutAddress: outToken?.token.address as Hash | undefined,
  });
  const [, setModalOpen] = useRecoilState(transactionModalStatus);

  const { info } = usePositionInfo();
  const settingValues = useSettingValue();

  const increaseLiquidity = useCallback(
    async (estimatedGas?: boolean) => {
      if (address && info && (inToken || outToken) && UNISWAP_CONTRACT) {
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
          deadline: settingValues.deadlineBySeconds,
          slippageTolerance: settingValues.slippage,
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
          const txValue = inIsEth
            ? inHexAmount
            : outIsETH
            ? outHexAmount
            : value;
          const isLayer2 = Boolean(layer === "L2");

          const txData = {
            to: UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
            from: address,
            value: txValue,
          };

          const transactionRequest = encodeMulticall({
            ...txData,
            contract: NonfungiblePositionManagerContract,
            multicallParam,
          });

          const gasLimit =
            multicallParam.length === 1
              ? await getSingleCalldataGasLimit(provider!, txData, calldata)
              : await calculateGasLimit(
                  provider!,
                  transactionRequest,
                  isLayer2,
                  isConnectedToMainNetwork
                );

          if (estimatedGas) return gasLimit;

          try {
            if (multicallParam.length === 1 && gasLimit) {
              const tx = await provider?.getSigner().sendTransaction({
                ...txData,
                data: calldata,
                gasLimit,
              });
              if (tx?.hash) return setTxHash(tx?.hash as Hash);
              return;
            }

            if (gasLimit) {
              const tx = await NonfungiblePositionManagerContract.multicall(
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
              );
              if (tx.hash) return setTxHash(tx.hash);
              return;
            }
          } catch (e) {
            console.log(e);
            setModalOpen("error");
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
      layer,
      isConnectedToMainNetwork,
      settingValues,
    ]
  );

  const [txHashToRemoveLiquidity, setTxHashToRemoveLiquidity] = useState<
    Hash | undefined
  >(undefined);
  const {} = useTx({
    hash: txHashToRemoveLiquidity,
    txSort: "Remove Liquidity",
    tokenAddress: info?.token0.address as Hash | undefined,
    tokenOutAddress: info?.token1.address as Hash | undefined,
  });
  const collectAsWETH = useRecoilValue(ATOM_collectWethOption);

  const removeLiquidity = useCallback(
    async (
      positionId: number | undefined,
      removeLiquidityPercentage: number | undefined,
      estimateGas?: boolean
    ) => {
      try {
        if (
          info &&
          address &&
          positionId &&
          removeLiquidityPercentage &&
          UNISWAP_CONTRACT
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
            recipient:
              collectAsWETH || !info.hasETH
                ? address
                : "0x0000000000000000000000000000000000000000",
          };

          const removeLiquidityOptions: RemoveLiquidityOptions = {
            deadline: settingValues.deadlineBySeconds,
            slippageTolerance: settingValues.slippage,
            tokenId: positionId,
            // percentage of liquidity to remove
            liquidityPercentage: new Percent(removeLiquidityPercentage, 100),
            collectOptions,
          };

          if (currentPosition && chainName) {
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
            const multicallFunction =
              NonfungiblePositionManagerContract.interface.getFunction(
                "multicall"
              );
            const decodedMulticallData =
              NonfungiblePositionManagerContract.interface.decodeFunctionData(
                multicallFunction,
                calldata
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
            const multicallParam = [
              //dcreaseLquidity call
              decodedMulticallData[0][0],
              //collect call
              decodedMulticallData[0][1],
              unwrapWETH9,
              sweepToken,
            ];
            const transactionRequest = encodeMulticall({
              contract: NonfungiblePositionManagerContract,
              to: UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
              from: address,
              value: undefined,
              multicallParam,
            });

            const txn = {
              data: calldata,
              to: UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
              from: address,
              value,
            };

            const gasLimit = info.hasETH
              ? await calculateGasLimit(
                  provider!,
                  transactionRequest,
                  layer === "L2",
                  false
                )
              : await provider?.estimateGas(txn);

            if (estimateGas) return gasLimit;

            try {
              if (info.hasETH && collectAsWETH === false && gasLimit) {
                const tx = await NonfungiblePositionManagerContract.multicall(
                  multicallParam,
                  {
                    gasLimit,
                  }
                );
                if (tx?.hash)
                  return setTxHashToRemoveLiquidity(tx.hash as Hash);
                return;
              }
              if (gasLimit) {
                const tx = await provider?.getSigner().sendTransaction({
                  ...txn,
                  gasLimit: calculateGasMargin(gasLimit),
                });
                if (tx?.hash)
                  return setTxHashToRemoveLiquidity(tx.hash as Hash);
                return;
              }
            } catch (e) {
              console.log(e);
              setModalOpen("error");
            }
          }
        }
      } catch (e) {
        console.log(e);
        if (!estimateGas) {
          setModalOpen("error");
        }
      }
    },
    [
      provider,
      info,
      address,
      UNISWAP_CONTRACT,
      layer,
      chainName,
      settingValues,
      collectAsWETH,
    ]
  );

  const [txHashToCollect, setTxHashToCollect] = useState<Hash | undefined>(
    undefined
  );
  const {} = useTx({
    hash: txHashToCollect,
    txSort: "Collect Fee",
    tokenAddress: info?.token0.address as Hash | undefined,
    tokenOutAddress: info?.token1.address as Hash | undefined,
  });

  const collectFees = useCallback(
    async (estimateGas?: boolean) => {
      // console.log("--collectFees--");
      // console.log(info, address);
      if (info && address && provider && chainName && UNISWAP_CONTRACT) {
        const token0 = info.token0;
        const token1 = info.token1;

        const collectOptions: CollectOptions = {
          tokenId: info.id,
          expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(
            token0,
            //@ts-ignore
            info.token0CollectedFeeBN as BigintIsh
          ),
          expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(
            token1,
            //@ts-ignore
            info.token1CollectedFeeBN as BigintIsh
          ),
          recipient: address,
        };

        const NonfungiblePositionManagerContract = new Contract(
          UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
          NONFUNGIBLE_POSITION_MANAGER_ABI,
          getProviderOrSigner(provider, address)
        );

        if (info.hasETH && collectAsWETH === false) {
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
          const multicallParam = [collectData, unwrapWETH9, sweepToken];

          const transactionRequest = encodeMulticall({
            contract: NonfungiblePositionManagerContract,
            to: UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
            from: address,
            value: undefined,
            multicallParam,
          });
          const isLayer2 = Boolean(layer === "L2");
          const gasLimit = await calculateGasLimit(
            provider,
            transactionRequest,
            isLayer2,
            isConnectedToMainNetwork
          );

          if (estimateGas) return gasLimit;

          try {
            const tx = await NonfungiblePositionManagerContract.multicall(
              multicallParam,
              {
                gasLimit,
              }
            );
            if (tx.hash) return setTxHashToCollect(tx.hash);
          } catch (e) {
            console.log(e);
            if (!estimateGas) {
              return setModalOpen("error");
            }
          }
        }

        //collect as WETH
        try {
          const { calldata } =
            NonfungiblePositionManager.collectCallParameters(collectOptions);

          const txn = {
            data: calldata,
            to: UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
            from: address,
            value: undefined,
          };

          const gasLimit = await provider.estimateGas(txn);

          if (estimateGas) return calculateGasMargin(gasLimit);
          const tx = await provider.getSigner().sendTransaction({
            ...txn,
            gasLimit: calculateGasMargin(gasLimit),
          });
          if (tx.hash) return setTxHashToCollect(tx.hash as Hash);
        } catch (e) {
          console.log(e);
          return setModalOpen("error");
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
      layer,
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
