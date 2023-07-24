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
import { useMintPositionInfo } from "./useMintPositionInfo";
import { log } from "console";
import { poolModalProp } from "@/recoil/modal/atom";

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
  const { provider } = useProvier();
  const { UNISWAP_CONTRACT } = useContract();

  const { address } = useAccount();
  const { blockNumber } = useBlockNum();
  const { layer, connectedChainId } = useConnectedNetwork();

  const [positions, setPositions] = useRecoilState(ATOM_positions);

  const callPositionIds = useCallback(async () => {
    if (address && connectedChainId && provider) {
      const NonfungiblePositionManagerContract = new ethers.Contract(
        UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
        NONFUNGIBLE_POSITION_MANAGER_ABI,
        provider
      );
      // Get number of positions
      const balance: number =
        await NonfungiblePositionManagerContract.balanceOf(address);

      // Get all positions
      const positions: PoolCardDetail[] = [];
      for (let i = 0; i < balance; i++) {
        const tokenOfOwnerByIndex: number =
          await NonfungiblePositionManagerContract.tokenOfOwnerByIndex(
            address,
            i
          );
        const positionInfo = await NonfungiblePositionManagerContract.positions(
          tokenOfOwnerByIndex
        );
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

        const currentPoolAddress = computePoolAddress({
          factoryAddress: UNISWAP_CONTRACT.POOL_FACTORY_CONTRACT_ADDRESS,
          tokenA: new Token(connectedChainId, token0, token0Decimals),
          tokenB: new Token(connectedChainId, token1, token1Decimals),
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

        const remainedTokens =
          await NonfungiblePositionManagerContract.callStatic.decreaseLiquidity(
            {
              tokenId: positionId,
              liquidity,
              deadline: Math.floor(Date.now() / 1000) + 60 * 20,
              amount0Min: 0,
              amount1Min: 0,
            }
          );
        const token0Amount = ethers.utils.formatUnits(
          remainedTokens.amount0.toString(),
          token0Decimals
        );
        const token1Amount = ethers.utils.formatUnits(
          remainedTokens.amount1.toString(),
          token1Decimals
        );

        positions.push({
          id: positionId,
          fee,
          token0: new Token(
            connectedChainId,
            token0,
            token0Decimals,
            token0Symbol === "WETH" ? "ETH" : token0Symbol,
            token0Name
          ),
          token1: new Token(
            connectedChainId,
            token1,
            token1Decimals,
            token1Symbol === "WETH" ? "ETH" : token1Symbol,
            token1Name
          ),
          token0Amount,
          token1Amount,
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
        });
      }
      return positions;
    }
    return undefined;
  }, [UNISWAP_CONTRACT, address, provider]);

  useEffect(() => {
    const fetchPositionIds = async () => {
      const result = await callPositionIds();
      return setPositions(result);
    };
    fetchPositionIds().catch((e) => {
      console.log("**fetchPositionIds err**");
      // console.log(e);
    });
  }, [blockNumber, connectedChainId]);

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
  const existingPositionInfo = useMemo(() => {
    const positionId = pathName.split("/")[pathName.split("/").length - 1];

    if (!isNaN(Number(positionId)) && positions) {
      const result = positions.filter(
        (poisitonData) => poisitonData.id === Number(positionId)
      );
      return result[0] ?? undefined;
    }
  }, [pathName, positions]);

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
