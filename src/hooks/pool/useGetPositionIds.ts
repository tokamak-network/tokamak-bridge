"use client";

import { ethers } from "ethers";
import NONFUNGIBLE_POSITION_MANAGER_ABI from "@/abis/NONFUNGIBLE_POSITION_MANAGER_ABI.json";
import { useProvier } from "../provider/useProvider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import useBlockNum from "../network/useBlockNumber";
import { SqrtPriceMath, TickMath, computePoolAddress } from "@uniswap/v3-sdk";
import useConnectedNetwork from "../network";
import {
  L2_initCodeHashManualOverride,
  UniswapContractByChainId,
} from "@/constant/contracts/uniswap";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { Token } from "@uniswap/sdk-core";
import ERC20_ABI from "@/abis/erc20.json";
import { PoolCardDetail } from "@/app/pools/components/PoolCard";
import { usePathname, useSearchParams } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  ATOM_positions,
  ATOM_positionForInfo,
  ATOM_positions_loading,
  ATOM_positionForInfo_loading,
} from "@/recoil/pool/positions";
import { poolModalProp } from "@/recoil/modal/atom";
import { getWETHAddressByChainId } from "@/utils/token/isETH";
import { fetchMarketPrice } from "@/utils/price/fetchMarketPrice";
import commafy from "@/utils/trim/commafy";
import { sortPositions } from "@/utils/pool/sortPositions";
import { txHashLog, txPendingStatus } from "@/recoil/global/transaction";
import { useGetMode } from "../mode/useGetMode";
import JSBI from "jsbi";
import { providerByChainId } from "@/config/getProvider";
import { useGetPositionByClients } from "./useApolloClient";

export const makePositionDatas = async (
  positionData: any[],
  chainId: number
) => {
  const positions: PoolCardDetail[] = [];
  const batchSize = positionData.length;
  const promises: any[] = [];

  for (let i = 0; i < batchSize; i++) {
    promises.push(async () => {
      const position = positionData[i];
      const { id, owner, pool } = position;
      const { token0, token1, feeTier } = pool;

      //logic to calculate remained tokens amounts
      let amount0;
      let amount1;
      const slot0TickSub = parseInt(position.pool.tick);
      const tickLowerSub = parseInt(position.tickLower.tickIdx);
      const tickUpperSub = parseInt(position.tickUpper.tickIdx);
      const sqrtPriceSub = JSBI.BigInt(position.pool.sqrtPrice);
      const uppersqrtPriceSub = TickMath.getSqrtRatioAtTick(tickUpperSub);
      const lowersqrtPriceSub = TickMath.getSqrtRatioAtTick(tickLowerSub);
      const liquiditySub = JSBI.BigInt(position.liquidity);
      if (slot0TickSub < tickLowerSub) {
        amount0 = SqrtPriceMath.getAmount0Delta(
          lowersqrtPriceSub,
          uppersqrtPriceSub,
          liquiditySub,
          false
        );
        amount1 = JSBI.BigInt(0);
      } else if (slot0TickSub < tickUpperSub) {
        amount0 = SqrtPriceMath.getAmount0Delta(
          sqrtPriceSub,
          uppersqrtPriceSub,
          liquiditySub,
          false
        );
        amount1 = SqrtPriceMath.getAmount1Delta(
          lowersqrtPriceSub,
          sqrtPriceSub,
          liquiditySub,
          false
        );
      } else {
        amount0 = JSBI.BigInt(0);
        amount1 = SqrtPriceMath.getAmount1Delta(
          lowersqrtPriceSub,
          uppersqrtPriceSub,
          liquiditySub,
          false
        );
      }
      const isClosed = JSBI.equal(
        JSBI.add(amount0 as JSBI, amount1 as JSBI),
        JSBI.BigInt(0)
      );
      const token0Amount =
        amount0 &&
        ethers.utils
          .formatUnits(amount0.toString(), token0.decimals)
          .slice(0, 10);
      const token1Amount =
        amount1 &&
        ethers.utils
          .formatUnits(amount1.toString(), token1.decimals)
          .slice(0, 10);

      const token0CollectedFee =
        amount0 &&
        ethers.utils
          .formatUnits(amount0.toString(), token0.decimals)
          .slice(0, 10);
      const token1CollectedFee =
        amount0 &&
        ethers.utils
          .formatUnits(amount0.toString(), token1.decimals)
          .slice(0, 10);

      const token0MarketPrice = await fetchMarketPrice(token0.name);
      const token1MarketPrice = await fetchMarketPrice(token1.name);
      const token0Value = token0MarketPrice * Number(token0Amount);
      const token1Value = token1MarketPrice * Number(token1Amount);
      const token0FeeAmount = Number(commafy(token0CollectedFee, 8, true));
      const token1FeeAmount = Number(commafy(token1CollectedFee, 8, true));
      const token0FeeValue = token0MarketPrice * token0FeeAmount;
      const token1FeeValue = token1MarketPrice * token1FeeAmount;
      const feeValue = token0FeeValue + token1FeeValue;
      const inRange =
        tickLowerSub <= slot0TickSub && slot0TickSub < tickUpperSub;

      return {
        id,
        fee: Number(feeTier),
        token0Amount: Number(token0Amount),
        token1Amount: Number(token1Amount),
        token0CollectedFee: token0CollectedFee.toString(),
        token1CollectedFee: token1CollectedFee.toString(),
        token0CollectedFeeBN: amount0,
        token1CollectedFeeBN: amount1,
        token0MarketPrice,
        token1MarketPrice,
        inRange,
        isClosed,
        token0Value: isNaN(token0Value) ? 0 : token0Value,
        token1Value: isNaN(token1Value) ? 0 : token1Value,
        token0FeeValue,
        token1FeeValue,
        feeValue: isNaN(feeValue) ? 0 : feeValue,
        chainId,
        owner,
        hasETH: false,
        liquidity: "",
        rawPositionInfo: "",
        sqrtPriceX96: "",
        tickCurrent: 0,
        tickLower: 0,
        tickUpper: 0,
        token0: new Token(
          chainId,
          token0.id,
          Number(token0.decimals),
          token0.symbol === "WETH" ? "ETH" : token0.symbol,
          token0.name
        ),
        token1: new Token(
          chainId,
          token1.id,
          Number(token1.decimals),
          token1.symbol === "WETH" ? "ETH" : token1.symbol,
          token1.name
        ),
        rawData: position,
      };
    });
  }
  const result = await Promise.all(promises.map((func) => func()));
  return result;
};

//logic through subGraph
export function useGetPositionIds(): {
  positions: PoolCardDetail[] | undefined;
} {
  const { address } = useAccount();
  const { connectedChainId, isSupportedChain, chainGroup } =
    useConnectedNetwork();

  const [positions, setPositions] = useRecoilState(ATOM_positions);
  const [, setPositionsLoading] = useRecoilState(ATOM_positions_loading);
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const txLog = useRecoilValue(txHashLog);

  const { datas: positionDatas } = useGetPositionByClients();

  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        if (connectedChainId && chainGroup) {
          if (
            (address && account !== address) ||
            (connectedChainId && chainId !== connectedChainId)
          ) {
            setAccount(address);
            setChainId(connectedChainId);
            setPositionsLoading(true);
            setPositions(undefined);
          }

          if (!isSupportedChain) return setPositions([]);

          //need to apply additional logic for chainGroup to support multi chain more than 2
          if (positionDatas && chainGroup) {
            const positions = await Promise.all(
              positionDatas.map((position, index) => {
                if (position?.data?.positions) {
                  return makePositionDatas(
                    position.data.positions,
                    chainGroup[index === 1 ? index + 1 : index].chainId ?? 0
                  );
                }
              })
            );
            const sortedPositions = sortPositions(
              positions.filter((position) => position !== undefined).flat()
            );
            return setPositions(sortedPositions);
          }

          return setPositions([]);
        }
      } catch (e) {
        console.log("**fetchPositionData err**");
        console.log("positionData", positionDatas);
        console.log(e);
      } finally {
        setPositionsLoading(false);
      }
    };
    fetchPositionData();
  }, [
    connectedChainId,
    txLog,
    address,
    //need to change a logic to put dymamically each property of this array
    //if this array is just put as a denpendency, it will cause so much re-rendering
    //becase there is a issue to track changes with array on useEffect
    positionDatas?.[0],
    positionDatas?.[1],
    chainGroup,
    setPositions,
  ]);

  // useEffect(() => {
  //   if (positions === undefined) return setPositionsLoading(true);
  //   setPositionsLoading(false);
  // }, [positions]);

  return { positions };
}

//logic through contract calls
export function useGetPositionById(positionId: number, chainId: number) {
  const { provider: _provider } = useProvier();
  const { blockNumber } = useBlockNum();
  const { connectedChainId, layer } = useConnectedNetwork();
  const pathName = usePathname();

  const [positions, setPositions] = useRecoilState<
    PoolCardDetail[] | undefined
  >(ATOM_positionForInfo);
  const [, setIsLoading] = useRecoilState<boolean>(
    ATOM_positionForInfo_loading
  );

  const provider = useMemo(() => {
    if (connectedChainId === chainId) {
      return _provider;
    }
    return providerByChainId[chainId];
  }, [_provider, connectedChainId, chainId]);

  const callPositionIds = useCallback(
    async (positionTokenId: number) => {
      const UNISWAP_CONTRACT = UniswapContractByChainId[chainId];

      if (provider && chainId && positionTokenId && UNISWAP_CONTRACT) {
        const NonfungiblePositionManagerContract = new ethers.Contract(
          UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
          NONFUNGIBLE_POSITION_MANAGER_ABI,
          provider
        );
        // Get number of positions
        // const balance: number =
        //   await NonfungiblePositionManagerContract.balanceOf(address);

        // Get all positions
        const positions: PoolCardDetail[] = [];
        // const batchSize = positionTokenId ? 1 : balance;
        const promises: any[] = [];
        promises.push(async () => {
          const owner = await NonfungiblePositionManagerContract.ownerOf(
            positionTokenId
          );

          const positionInfo =
            await NonfungiblePositionManagerContract.positions(positionTokenId);

          const { token0, token1, fee, tickLower, tickUpper, liquidity } =
            positionInfo;

          const token0Contract = new ethers.Contract(
            token0,
            ERC20_ABI.abi,
            provider
          );
          const token1Contract = new ethers.Contract(
            token1,
            ERC20_ABI.abi,
            provider
          );

          const [
            token0Symbol,
            token1Symbol,
            token0Name,
            token1Name,
            token0Decimals,
            token1Decimals,
          ] = await Promise.all([
            token0Contract.symbol(),
            token1Contract.symbol(),
            token0Contract.name(),
            token1Contract.name(),
            token0Contract.decimals(),
            token1Contract.decimals(),
          ]);

          const tokenA = new Token(
            chainId,
            token0,
            token0Decimals,
            token0Symbol === "WETH" ? "ETH" : token0Symbol,
            token0Name
          );
          const tokenB = new Token(
            chainId,
            token1,
            token1Decimals,
            token1Symbol === "WETH" ? "ETH" : token1Symbol,
            token1Name
          );

          const currentPoolAddress = computePoolAddress({
            factoryAddress: UNISWAP_CONTRACT.POOL_FACTORY_CONTRACT_ADDRESS,
            tokenA,
            tokenB,
            fee,
            initCodeHashManualOverride:
              layer === "L2" ? L2_initCodeHashManualOverride : undefined,
          });

          const POOL_CONTRACT = new ethers.Contract(
            currentPoolAddress,
            IUniswapV3PoolABI.abi,
            provider
          );

          const slot = await POOL_CONTRACT.slot0();
          const { tick, sqrtPriceX96 } = slot;
          const inRange = tickLower <= tick && tick < tickUpper;
          const positionId = Number(positionTokenId);

          const earningFee =
            await NonfungiblePositionManagerContract.callStatic.collect({
              tokenId: positionId,
              recipient: owner,
              amount0Max: ethers.BigNumber.from(2).pow(128).sub(1),
              amount1Max: ethers.BigNumber.from(2).pow(128).sub(1),
            });

          const token0CollectedFee = ethers.utils
            .formatUnits(earningFee.amount0, token0Decimals)
            .slice(0, 10);
          const token1CollectedFee = ethers.utils
            .formatUnits(earningFee.amount1, token1Decimals)
            .slice(0, 10);

          const hasNoLiquidity = Number(liquidity.toString()) === 0;

          const remainedTokens = hasNoLiquidity
            ? undefined
            : await NonfungiblePositionManagerContract.callStatic.decreaseLiquidity(
                {
                  tokenId: positionId,
                  liquidity,
                  deadline: Math.floor(Date.now() / 1000) + 60 * 20,
                  amount0Min: 0,
                  amount1Min: 0,
                }
              );

          const token0Amount = hasNoLiquidity
            ? "0"
            : ethers.utils.formatUnits(
                remainedTokens.amount0.toString(),
                token0Decimals
              );

          const token1Amount = hasNoLiquidity
            ? "0"
            : ethers.utils.formatUnits(
                remainedTokens.amount1.toString(),
                token1Decimals
              );

          const WETH_ADDRESS = getWETHAddressByChainId(chainId);
          const token0IsNative =
            WETH_ADDRESS.toLowerCase() === token0.toLowerCase();
          const token1IsNative =
            WETH_ADDRESS.toLowerCase() === token1.toLowerCase();

          const isClosed = Number(token0Amount) + Number(token1Amount) <= 0;

          const token0MarketPrice = await fetchMarketPrice(token0Name);
          const token1MarketPrice = await fetchMarketPrice(token1Name);
          const token0Value = token0MarketPrice * Number(token0Amount);
          const token1Value = token1MarketPrice * Number(token1Amount);
          const token0FeeAmount = Number(commafy(token0CollectedFee, 8, true));
          const token1FeeAmount = Number(commafy(token1CollectedFee, 8, true));
          const token0FeeValue = token0MarketPrice * token0FeeAmount;
          const token1FeeValue = token1MarketPrice * token1FeeAmount;
          const feeValue = token0FeeValue + token1FeeValue;

          positions.push({
            id: positionId,
            fee,
            token0: tokenA,
            token1: tokenB,
            token0Amount: Number(token0Amount),
            token1Amount: Number(token1Amount),
            token0CollectedFee,
            token1CollectedFee,
            token0CollectedFeeBN: earningFee.amount0,
            token1CollectedFeeBN: earningFee.amount1,
            token0MarketPrice,
            token1MarketPrice,
            inRange,
            liquidity: liquidity.toString(),
            sqrtPriceX96: sqrtPriceX96.toString(),
            tickLower,
            tickCurrent: tick,
            tickUpper,
            rawPositionInfo: { ...positionInfo, sqrtPriceX96 },
            hasETH: token0IsNative || token1IsNative,
            isClosed,
            token0Value: isNaN(token0Value) ? 0 : token0Value,
            token1Value: isNaN(token1Value) ? 0 : token1Value,
            token0FeeValue,
            token1FeeValue,
            feeValue: isNaN(feeValue) ? 0 : feeValue,
            chainId,
            owner,
            rawData: positionInfo,
          });
        });
        await Promise.all(promises.map((func) => func()));
        return positions;
      }
      return undefined;
    },
    [layer, provider, chainId, blockNumber]
  );

  const txPending = useRecoilValue(txPendingStatus);

  useEffect(() => {
    const fetchPositionIds = async () => {
      if (positions === undefined) {
        setIsLoading(true);
      }
      try {
        // setIsLoading(true);
        const result = await callPositionIds(positionId);
        if (result) {
          return setPositions(result);
        }
        return setPositions(undefined);
      } finally {
        // setIsLoading(false);
        setIsLoading(false);
      }
    };
    fetchPositionIds().catch((e) => {
      console.log("**fetchPositionIds err**");
      console.log(e);
      if (e.toString().includes("nonexistent")) {
        // setIsLoading(false);
        return setPositions(undefined);
      }
    });
    //add pathName to fetch new data when it's back from increase / decrease liquidity page
  }, [blockNumber, txPending, positionId, pathName]);

  return { positions };
}

export function useGetPositionIdFromPath() {
  const pathName = usePathname();
  const positionId = useMemo(() => {
    return pathName.split("/")[pathName.split("/").length - 1];
  }, [pathName]);

  const searchParams = useSearchParams();
  const chainIdParam = useMemo(() => {
    return searchParams.get("chainId");
  }, [searchParams]);

  const backwardLink = useMemo(() => {
    return `/pools/${positionId}?chainId=${chainIdParam}`;
  }, [positionId, chainIdParam]);

  return { positionId, chainIdParam, backwardLink };
}

let count = 0;

export function usePositionInfo() {
  const { positionId, chainIdParam } = useGetPositionIdFromPath();
  const { positions } = useGetPositionById(
    Number(positionId),
    Number(chainIdParam)
  );

  const existingPositionInfo = positions ? positions[0] : undefined;
  const mintPositionInfo = useRecoilValue(poolModalProp);
  const { subMode } = useGetMode();

  const info = useMemo(() => {
    return subMode.add ? mintPositionInfo : existingPositionInfo;
  }, [subMode.add, mintPositionInfo, existingPositionInfo]);

  const tokenPairForInfo = useMemo(() => {
    if (info) {
      return {
        token0Symbol: info.token0.symbol,
        token1Symbol: info.token1.symbol,
      };
    }
  }, [info]);

  return { info, tokenPairForInfo };
}
