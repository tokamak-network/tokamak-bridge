import { BigintIsh, Currency, Token } from "@uniswap/sdk-core";
import { computePoolAddress } from "@uniswap/v3-sdk";
import { FeeAmount, Pool } from "@uniswap/v3-sdk";
import JSBI from "jsbi";
import { useEffect, useMemo, useState } from "react";
import {
  L2_initCodeHashManualOverride,
  V3_CORE_FACTORY_ADDRESSES,
} from "@/constant/contracts/uniswap";
import useConnectedNetwork from "../network";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { ethers } from "ethers";
import { useProvier } from "../provider/useProvider";
import { useInOutTokens } from "../token/useInOutTokens";
import { useGetFeeTier } from "./useGetFeeTier";
import { PoolState } from "@/types/pool/pool";
import { useGetPositionIdFromPath } from "./useGetPositionIds";
import { useGetMode } from "../mode/useGetMode";
import { checkLayer } from "@/utils/network/checkLayer";

export function usePoolData(poolAddress: string | undefined) {
  const [poolData, setPoolData] = useState<any | undefined>(undefined);
  const { provider } = useProvier();

  useEffect(() => {
    const fetchPoolData = async () => {
      if (poolAddress && provider) {
        const poolContract = new ethers.Contract(
          poolAddress,
          IUniswapV3PoolABI.abi,
          provider
        );

        const [liquidity, slot0] = await Promise.all([
          poolContract.liquidity(),
          poolContract.slot0(),
        ]);

        const result = {
          liquidity,
          slot0,
        };
        return setPoolData(result);
      }
    };
    fetchPoolData().catch((e) => {
      console.log("**fetchPoolData err**");
      // console.log(e);
      setPoolData(undefined);
    });
    // const interval = setInterval(
    //   () =>
    //     fetchPoolData().catch((e) => {
    //       console.log("**fetchPoolData err**");
    //       setPoolData(undefined);
    //       // console.log(e);
    //     }),
    //   1000
    // );
    // return () => clearInterval(interval);
  }, [poolAddress, provider]);

  return poolData;
}

// Classes are expensive to instantiate, so this caches the recently instantiated pools.
// This avoids re-instantiating pools as the other pools in the same request are loaded.
class PoolCache {
  // Evict after 128 entries. Empirically, a swap uses 64 entries.
  private static MAX_ENTRIES = 128;

  // These are FIFOs, using unshift/pop. This makes recent entries faster to find.
  private static pools: Pool[] = [];
  private static addresses: { key: string; address: string }[] = [];

  static getPoolAddress(
    factoryAddress: string,
    tokenA: Token,
    tokenB: Token,
    fee: FeeAmount,
    layer: "L1" | "L2" | undefined
  ): string {
    if (this.addresses.length > this.MAX_ENTRIES) {
      this.addresses = this.addresses.slice(0, this.MAX_ENTRIES / 2);
    }

    const { address: addressA } = tokenA;
    const { address: addressB } = tokenB;
    const key = `${factoryAddress}:${addressA}:${addressB}:${fee.toString()}`;
    const found = this.addresses.find((address) => address.key === key);
    if (found) return found.address;

    const address = {
      key,
      address: computePoolAddress({
        factoryAddress,
        tokenA,
        tokenB,
        fee,
        initCodeHashManualOverride:
          layer === "L2" ? L2_initCodeHashManualOverride : undefined,
      }),
    };

    this.addresses.unshift(address);
    return address.address;
  }

  static getPool(
    tokenA: Token,
    tokenB: Token,
    fee: FeeAmount,
    sqrtPriceX96: BigintIsh,
    liquidity: BigintIsh,
    tick: number
  ): Pool {
    if (this.pools.length > this.MAX_ENTRIES) {
      this.pools = this.pools.slice(0, this.MAX_ENTRIES / 2);
    }

    const found = this.pools.find(
      (pool) =>
        pool.token0 === tokenA &&
        pool.token1 === tokenB &&
        pool.fee === fee &&
        JSBI.EQ(pool.sqrtRatioX96, sqrtPriceX96) &&
        JSBI.EQ(pool.liquidity, liquidity) &&
        pool.tickCurrent === tick
    );
    if (found) return found;

    const pool = new Pool(tokenA, tokenB, fee, sqrtPriceX96, liquidity, tick);
    this.pools.unshift(pool);
    return pool;
  }
}

export function usePools(
  poolKeys: [
    Currency | undefined,
    Currency | undefined,
    FeeAmount | undefined
  ][]
) {
  // : [PoolState, Pool | null][]
  const { connectedChainId } = useConnectedNetwork();
  const { chainIdParam } = useGetPositionIdFromPath();
  const { subMode } = useGetMode();
  const chainId = subMode.add ? connectedChainId : Number(chainIdParam);
  const layer = checkLayer(chainId);

  const poolTokens: ([Token, Token, FeeAmount] | undefined)[] = useMemo(() => {
    // if (!connectedChainId) return new Array(poolKeys.length);

    return poolKeys.map(([currencyA, currencyB, feeAmount]) => {
      if (currencyA && currencyB && feeAmount) {
        const tokenA = currencyA.wrapped;
        const tokenB = currencyB.wrapped;
        if (tokenA.equals(tokenB)) return undefined;

        return tokenA.sortsBefore(tokenB)
          ? [tokenA, tokenB, feeAmount]
          : [tokenB, tokenA, feeAmount];
      }
      return undefined;
    });
  }, [poolKeys]);

  const poolAddresses: (string | undefined)[] = useMemo(() => {
    const v3CoreFactoryAddress = chainId && V3_CORE_FACTORY_ADDRESSES[chainId];
    if (!v3CoreFactoryAddress) return new Array(poolTokens.length);

    return poolTokens.map(
      (value) =>
        value && PoolCache.getPoolAddress(v3CoreFactoryAddress, ...value, layer)
    );
  }, [chainId, poolTokens, layer, connectedChainId]);

  const pooldata = usePoolData(poolAddresses[0]);

  return useMemo(() => {
    return poolKeys.map((_key, index) => {
      const tokens = poolTokens[index];

      if (!tokens) return [PoolState.INVALID, null];

      const [token0, token1, fee] = tokens;
      const liquidity = pooldata?.liquidity;
      const slot0 = pooldata?.slot0;

      if (poolTokens === undefined) return [PoolState.INVALID, null];
      //not initialized
      if (!slot0 || !liquidity) return [PoolState.NOT_EXISTS, null];
      if (!slot0.sqrtPriceX96 || slot0.sqrtPriceX96.eq(0))
        return [PoolState.NOT_EXISTS, null];

      try {
        const pool = PoolCache.getPool(
          token0,
          token1,
          fee,
          slot0.sqrtPriceX96,
          liquidity,
          slot0.tick
        );
        return [PoolState.EXISTS, pool];
      } catch (error) {
        console.error("Error when constructing the pool", error);
        return [PoolState.NOT_EXISTS, null];
      }
    });
  }, [pooldata?.liquidity, poolKeys, pooldata?.slot0, poolKeys]);
}

export function usePool(
  token0?: Currency | Token,
  token1?: Currency | Token,
  fee?: FeeAmount
): [PoolState, Pool | null] {
  const { inToken, outToken } = useInOutTokens();
  const { feeTier } = useGetFeeTier();

  const poolKeys: [
    Currency | undefined,
    Currency | undefined,
    FeeAmount | undefined
  ][] = useMemo(
    () => [
      [token0 ?? inToken?.token, token1 ?? outToken?.token, fee ?? feeTier],
    ],
    [token0, token1, fee, inToken, outToken, feeTier]
  );

  //@ts-ignore
  return usePools(poolKeys)[0];
}
