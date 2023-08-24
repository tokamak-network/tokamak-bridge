"use client";

import { ethers } from "ethers";
import NONFUNGIBLE_POSITION_MANAGER_ABI from "@/abis/NONFUNGIBLE_POSITION_MANAGER_ABI.json";
import { useProvier } from "../provider/useProvider";
import useContract from "../contracts/useContract";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import useBlockNum from "../network/useBlockNumber";
import { computePoolAddress } from "@uniswap/v3-sdk";
import useConnectedNetwork from "../network";
import { L2_initCodeHashManualOverride } from "@/constant/contracts/uniswap";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { Token } from "@uniswap/sdk-core";
import ERC20_ABI from "@/abis/erc20.json";
import { PoolCardDetail } from "@/app/pools/components/PoolCard";
import { usePathname } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import { ATOM_positions } from "@/recoil/pool/positions";
import { poolModalProp } from "@/recoil/modal/atom";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";
import { getWETHAddress } from "@/utils/token/isETH";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";
import { fetchMarketPrice } from "@/utils/price/fetchMarketPrice";
import commafy from "@/utils/trim/commafy";
import { sortPositions } from "@/utils/pool/sortPositions";

//logic through subGraph
// export default function useGetPositionIds(): {
//   positionInfo: PoolCardDetail[] | undefined;
// } {
//   const { address } = useAccount();
//   const { connectedChainId } = useConnectedNetwork();
//   const [positionInfo, setPositionInfo] = useState<
//     PoolCardDetail[] | undefined
//   >(undefined);

//   const { data, error } = useQuery(GET_POSITIONS, {
//     variables: {
//       account: address,
//     },
//     pollInterval: 10000,
//   });

//   return { positionInfo: data?.length > 0 ? data : undefined };
// }

//logic through contract calls
export function useGetPositions() {
  const { provider, otherLayerProvider } = useProvier();
  const { UNISWAP_CONTRACT } = useContract();
  const { UNISWAP_CONTRACT_OTHER_LAYER } = useUniswapContracts();

  const { address } = useAccount();
  const { blockNumber } = useBlockNum();
  const { layer, connectedChainId, chainName, otherLayerChainInfo } =
    useConnectedNetwork();

  const [positions, setPositions] = useRecoilState(ATOM_positions);

  const callPositionIds = useCallback(
    async (otherLayer?: boolean) => {
      if (
        address &&
        connectedChainId &&
        provider &&
        chainName &&
        otherLayerProvider &&
        otherLayerChainInfo
      ) {
        const _provider = otherLayer ? otherLayerProvider : provider;
        const _otherLayerChainId = otherLayerChainInfo.chainId;

        const NonfungiblePositionManagerContract = new ethers.Contract(
          otherLayer
            ? UNISWAP_CONTRACT_OTHER_LAYER.NONFUNGIBLE_POSITION_MANAGER
            : UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
          NONFUNGIBLE_POSITION_MANAGER_ABI,
          _provider
        );
        // Get number of positions
        const balance: number =
          await NonfungiblePositionManagerContract.balanceOf(address);

        // Get all positions
        const positions: PoolCardDetail[] = [];
        for (let i = 0; i < Number(balance.toString()); i++) {
          const tokenOfOwnerByIndex: number =
            await NonfungiblePositionManagerContract.tokenOfOwnerByIndex(
              address,
              i
            );
          const positionInfo =
            await NonfungiblePositionManagerContract.positions(
              tokenOfOwnerByIndex
            );

          const { token0, token1, fee, tickLower, tickUpper, liquidity } =
            positionInfo;

          const token0Contract = new ethers.Contract(
            token0,
            ERC20_ABI.abi,
            _provider
          );
          const token1Contract = new ethers.Contract(
            token1,
            ERC20_ABI.abi,
            _provider
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

          const currentPoolAddress = computePoolAddress({
            factoryAddress: otherLayer
              ? UNISWAP_CONTRACT_OTHER_LAYER.POOL_FACTORY_CONTRACT_ADDRESS
              : UNISWAP_CONTRACT.POOL_FACTORY_CONTRACT_ADDRESS,
            tokenA: new Token(
              otherLayer ? _otherLayerChainId : connectedChainId,
              token0,
              token0Decimals
            ),
            tokenB: new Token(
              otherLayer ? _otherLayerChainId : connectedChainId,
              token1,
              token1Decimals
            ),
            fee,
            initCodeHashManualOverride:
              otherLayer && layer === "L1"
                ? L2_initCodeHashManualOverride
                : layer === "L2"
                ? L2_initCodeHashManualOverride
                : undefined,
          });

          const POOL_CONTRACT = new ethers.Contract(
            currentPoolAddress,
            IUniswapV3PoolABI.abi,
            _provider
          );
          const slot = await POOL_CONTRACT.slot0();
          const { tick, sqrtPriceX96 } = slot;
          const inRange = tickLower <= tick && tick < tickUpper;

          const positionId = Number(tokenOfOwnerByIndex.toString());

          const earningFee =
            await NonfungiblePositionManagerContract.callStatic.collect({
              tokenId: positionId,
              recipient: address,
              amount0Max: ethers.BigNumber.from(2).pow(128).sub(1),
              amount1Max: ethers.BigNumber.from(2).pow(128).sub(1),
            });

          const token0CollectedFee = ethers.utils.formatUnits(
            earningFee.amount0.toString(),
            token0Decimals
          );
          const token1CollectedFee = ethers.utils.formatUnits(
            earningFee.amount1.toString(),
            token1Decimals
          );

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

          const WETH_ADDRESS = getWETHAddress(chainName);
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
          const token1FeeValue = token0MarketPrice * token1FeeAmount;
          const feeValue = token0FeeValue + token1FeeValue;

          positions.push({
            id: positionId,
            fee,
            token0: new Token(
              otherLayer ? _otherLayerChainId : connectedChainId,
              token0,
              token0Decimals,
              token0Symbol === "WETH" ? "ETH" : token0Symbol,
              token0Name
            ),
            token1: new Token(
              otherLayer ? _otherLayerChainId : connectedChainId,
              token1,
              token1Decimals,
              token1Symbol === "WETH" ? "ETH" : token1Symbol,
              token1Name
            ),
            token0Amount: smallNumberFormmater(Number(token0Amount)),
            token1Amount: smallNumberFormmater(Number(token1Amount)),
            token0CollectedFee,
            token1CollectedFee,
            token0MarketPrice: "1.25",
            token1MarketPrice: "1.25",
            inRange,
            liquidity: liquidity.toString(),
            sqrtPriceX96: sqrtPriceX96.toString(),
            tickLower,
            tickCurrent: tick,
            tickUpper,
            rawPositionInfo: positionInfo,
            hasETH: token0IsNative || token1IsNative,
            isClosed,
            token0Value: isNaN(token0Value) ? 0 : token0Value,
            token1Value: isNaN(token1Value) ? 0 : token1Value,
            feeValue: isNaN(feeValue) ? 0 : feeValue,
            chainId: otherLayer ? _otherLayerChainId : connectedChainId,
          });
        }
        return positions;
      }
      return undefined;
    },
    [
      UNISWAP_CONTRACT,
      address,
      provider,
      otherLayerProvider,
      chainName,
      UNISWAP_CONTRACT_OTHER_LAYER,
      otherLayerChainInfo,
    ]
  );

  useEffect(() => {
    const fetchPositionIds = async () => {
      const result = await Promise.all([
        callPositionIds(),
        callPositionIds(true),
      ]);

      if (result[0] && result[1]) {
        const positions = [...result[0], ...result[1]];
        const sortedPositions = sortPositions(positions);
        return setPositions(sortedPositions);
      }
      if (result[0]) {
        const sortedPositions = sortPositions(result[0]);
        return setPositions(sortedPositions);
      }
      if (result[1]) {
        const sortedPositions = sortPositions(result[1]);
        return setPositions(sortedPositions);
      }
    };
    fetchPositionIds().catch((e) => {
      console.log("**fetchPositionIds err**");
      console.log(e);
    });
  }, [blockNumber, connectedChainId, address]);

  return { positions };
}

export function useGetPositionIdFromPath() {
  const pathName = usePathname();
  const positionId = pathName.split("/")[pathName.split("/").length - 1];

  return { positionId };
}

function useGetPositionInfo() {
  const { positions } = useGetPositions();
  const pathName = usePathname();
  const { otherLayerProvider } = useProvier();

  const { otherLayerChainInfo } = useConnectedNetwork();
  const existingPositionInfo = useMemo(() => {
    const positionId = pathName.split("/")[pathName.split("/").length - 1];

    if (!isNaN(Number(positionId)) && positions) {
      const result = positions.filter(
        (poisitonData) => poisitonData.id === Number(positionId)
      );
      return result[0] ?? undefined;
    }
  }, [pathName, positions, otherLayerProvider, otherLayerChainInfo]);

  return { existingPositionInfo };
}

export function usePositionInfo() {
  const { existingPositionInfo } = useGetPositionInfo();
  const mintPositionInfo = useRecoilValue(poolModalProp);

  const info = existingPositionInfo ?? mintPositionInfo;

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
