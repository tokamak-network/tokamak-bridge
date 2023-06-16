import { ethers } from "ethers";
import NONFUNGIBLE_POSITION_MANAGER_ABI from "@/abis/NONFUNGIBLE_POSITION_MANAGER_ABI.json";
import { useProvier } from "../provider/useProvider";
import useContract from "../contracts/useContract";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useBlockNum from "../network/useBlockNumber";
import { computePoolAddress } from "@uniswap/v3-sdk";
import useConnectedNetwork from "../network";
import { L2_initCodeHashManualOverride } from "@/constant/contracts/uniswap";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { Token } from "@uniswap/sdk-core";
import ERC20_ABI from "@/abis/erc20.json";

export default function useGetPositionIds() {
  const { provider } = useProvier();
  const { UNISWAP_CONTRACT } = useContract();

  const { address } = useAccount();
  const { blockNumber } = useBlockNum();
  const { layer, connectedChainId } = useConnectedNetwork();

  const [positionInfo, setPositionInfo] = useState<any[] | undefined>(
    undefined
  );

  const callPositionIds = useCallback(async () => {
    if (address && connectedChainId) {
      const positionContract = new ethers.Contract(
        UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
        NONFUNGIBLE_POSITION_MANAGER_ABI,
        provider
      );

      // Get number of positions
      const balance: number = await positionContract.balanceOf(address);

      // Get all positions
      const positions: any[] = [];
      for (let i = 0; i < balance; i++) {
        const tokenOfOwnerByIndex: number =
          await positionContract.tokenOfOwnerByIndex(address, i);
        const positionInfo = await positionContract.positions(
          tokenOfOwnerByIndex
        );
        const { token0, token1, fee, tickLower, tickUpper } = positionInfo;

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

        const [token0Decimals, token1Decimals] = await Promise.all([
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
        const { tick } = slot;
        const inRange = tickLower <= tick < tickUpper;

        positions.push({
          fee,
          token0,
          token1,
          inRange,
        });
      }
      return positions;
    }
    return undefined;
  }, [UNISWAP_CONTRACT, address]);

  useEffect(() => {
    const fetchPositionIds = async () => {
      const result = await callPositionIds();
      return setPositionInfo(result);
    };
    fetchPositionIds();
  }, [blockNumber]);

  return { positionInfo };
}
