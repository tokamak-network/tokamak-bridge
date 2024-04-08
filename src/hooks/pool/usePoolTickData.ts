import {
  ChainId,
  Currency,
  Token,
  V3_CORE_FACTORY_ADDRESSES,
} from "@uniswap/sdk-core";
import {
  computePoolAddress,
  FeeAmount,
  nearestUsableTick,
  Pool,
  TICK_SPACINGS,
  tickToPrice,
} from "@uniswap/v3-sdk";
import { ZERO_ADDRESS } from "@/constant/misc";
import { useAllV3TicksQuery } from "@/graphql/thegraph/__generated__/types-and-hooks";
import { TickData, Ticks } from "@/graphql/thegraph/AllV3TicksQuery";
import { subgraphApolloClients } from "@/graphql/thegraph/apollo";
import JSBI from "jsbi";
import ms from "ms";
import { useEffect, useMemo, useState } from "react";
import computeSurroundingTicks from "utils/pool/conputeSurroundingTicks";
import { useTickLens } from "hooks/pool/useTickLens";
import useConnectedNetwork from "../network";
import { usePool } from "./usePool";
import { PoolState } from "@/types/pool/pool";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import {
  L1_SEPOLIA_UniswapContracts,
  L2_THANOS_SEPOLIA_UniswapContracts,
  L2_UniswapContracts,
  L2_initCodeHashManualOverride,
  L2_TITAN_SEPOLIA_UniswapContracts,
} from "@/constant/contracts/uniswap";

const V3_CORE_FACTORY_ADDRESSES_WITH_TITAN: { [chainId: number]: string } = {
  ...V3_CORE_FACTORY_ADDRESSES,
  [SupportedChainId.TITAN]: L2_UniswapContracts.POOL_FACTORY_CONTRACT_ADDRESS,
  [SupportedChainId.SEPOLIA]:
    L1_SEPOLIA_UniswapContracts.POOL_FACTORY_CONTRACT_ADDRESS,
  [SupportedChainId.TITAN_SEPOLIA]:
    L2_TITAN_SEPOLIA_UniswapContracts.POOL_FACTORY_CONTRACT_ADDRESS,
};

const PRICE_FIXED_DIGITS = 8;
const CHAIN_IDS_MISSING_SUBGRAPH_DATA = [
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_GOERLI,
];

// Tick with fields parsed to JSBIs, and active liquidity computed.
export interface TickProcessed {
  tick: number;
  liquidityActive: JSBI;
  liquidityNet: JSBI;
  price0: string;
}

const REFRESH_FREQUENCY = { blocksPerFetch: 2 };

const getActiveTick = (
  tickCurrent: number | undefined,
  feeAmount: FeeAmount | undefined
) =>
  tickCurrent && feeAmount
    ? Math.floor(tickCurrent / TICK_SPACINGS[feeAmount]) *
      TICK_SPACINGS[feeAmount]
    : undefined;

const bitmapIndex = (tick: number, tickSpacing: number) => {
  return Math.floor(tick / tickSpacing / 256);
};

function useTicksFromTickLens(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined,
  numSurroundingTicks: number | undefined = 125
) {
  const [tickDataLatestSynced, setTickDataLatestSynced] = useState<TickData[]>(
    []
  );

  const [poolState, pool] = usePool(currencyA, currencyB, feeAmount);

  const tickSpacing = feeAmount && TICK_SPACINGS[feeAmount];

  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick =
    pool?.tickCurrent && tickSpacing
      ? nearestUsableTick(pool?.tickCurrent, tickSpacing)
      : undefined;

  const { connectedChainId: chainId } = useConnectedNetwork();

  const poolAddress =
    currencyA && currencyB && feeAmount && poolState === PoolState.EXISTS
      ? Pool.getAddress(
          currencyA?.wrapped,
          currencyB?.wrapped,
          feeAmount,
          undefined,
          chainId ? V3_CORE_FACTORY_ADDRESSES_WITH_TITAN[chainId] : undefined
        )
      : undefined;

  // it is also possible to grab all tick data but it is extremely slow
  // bitmapIndex(nearestUsableTick(TickMath.MIN_TICK, tickSpacing), tickSpacing)
  const minIndex = useMemo(
    () =>
      tickSpacing && activeTick
        ? bitmapIndex(
            activeTick - numSurroundingTicks * tickSpacing,
            tickSpacing
          )
        : undefined,
    [tickSpacing, activeTick, numSurroundingTicks]
  );

  const maxIndex = useMemo(
    () =>
      tickSpacing && activeTick
        ? bitmapIndex(
            activeTick + numSurroundingTicks * tickSpacing,
            tickSpacing
          )
        : undefined,
    [tickSpacing, activeTick, numSurroundingTicks]
  );

  const tickLensArgs: [string, number][] = useMemo(
    () =>
      maxIndex && minIndex && poolAddress && poolAddress !== ZERO_ADDRESS
        ? new Array(maxIndex - minIndex + 1)
            .fill(0)
            .map((_, i) => i + minIndex)
            .map((wordIndex) => [poolAddress, wordIndex])
        : [],
    [minIndex, maxIndex, poolAddress]
  );

  const useSingleContractMultipleData: any = (...args: any) => {};
  const tickLens = useTickLens();
  const callStates: any = useSingleContractMultipleData(
    tickLensArgs.length > 0 ? tickLens : undefined,
    "getPopulatedTicksInWord",
    tickLensArgs,
    REFRESH_FREQUENCY
  );

  const isError = undefined;
  const isLoading = undefined;
  const IsSyncing = undefined;
  const isValid = undefined;

  // const isError = useMemo(
  //   () => callStates.some(({ error }) => error),
  //   [callStates]
  // );
  // const isLoading = useMemo(
  //   () => callStates.some(({ loading }) => loading),
  //   [callStates]
  // );
  // const IsSyncing = useMemo(
  //   () => callStates.some(({ syncing }) => syncing),
  //   [callStates]
  // );
  // const isValid = useMemo(
  //   () => callStates.some(({ valid }) => valid),
  //   [callStates]
  // );

  const tickData: TickData[] = useMemo(
    () =>
      callStates
        ?.map(({ result }: any) => result?.populatedTicks)
        .reduce(
          (accumulator: any, current: any) => [
            ...accumulator,
            ...(current?.map((tickData: TickData) => {
              return {
                tick: tickData.tick,
                liquidityNet: JSBI.BigInt(tickData.liquidityNet),
              };
            }) ?? []),
          ],
          []
        ),
    [callStates]
  );

  // reset on input change
  useEffect(() => {
    setTickDataLatestSynced([]);
  }, [currencyA, currencyB, feeAmount]);

  // return the latest synced tickData even if we are still loading the newest data
  useEffect(() => {
    if (!IsSyncing && !isLoading && !isError && isValid) {
      setTickDataLatestSynced(tickData.sort((a, b) => a.tick - b.tick));
    }
  }, [isError, isLoading, IsSyncing, tickData, isValid]);

  return useMemo(
    () => ({
      isLoading,
      IsSyncing,
      isError,
      isValid,
      tickData: tickDataLatestSynced,
    }),
    [isLoading, IsSyncing, isError, isValid, tickDataLatestSynced]
  );
}

function useTicksFromSubgraph(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined,
  skip = 0
) {
  const { connectedChainId: chainId } = useConnectedNetwork();

  const poolAddress =
    chainId && currencyA && currencyB && feeAmount
      ? computePoolAddress({
          factoryAddress: V3_CORE_FACTORY_ADDRESSES_WITH_TITAN[chainId],
          tokenA: currencyA as Token,
          tokenB: currencyB as Token,
          fee: feeAmount,
          initCodeHashManualOverride:
            chainId === 55004 || chainId === 5050
              ? L2_initCodeHashManualOverride
              : undefined,
        })
      : undefined;

  // const poolAddress =
  //   currencyA && currencyB && feeAmount
  //     ? Pool.getAddress(
  //         currencyA?.wrapped,
  //         currencyB?.wrapped,
  //         feeAmount,
  //         undefined,
  //       chainId ? V3_CORE_FACTORY_ADDRESSES_WITH_TITAN[chainId] : undefined,
  //         initCodeHashManualOverride:
  //         chainId === 55004 || chainId === 5050 ? L2_initCodeHashManualOverride : undefined
  //       )
  //     : undefined;

  return useAllV3TicksQuery({
    variables: {
      poolAddress: poolAddress?.toLowerCase(),
      skip,
    },
    skip: !poolAddress,
    pollInterval: ms(`10s`),
    client: chainId ? subgraphApolloClients[chainId] : undefined,
  });
}

const MAX_THE_GRAPH_TICK_FETCH_VALUE = 1000;
// Fetches all ticks for a given pool
function useAllV3Ticks(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined
): {
  isLoading: boolean;
  error: unknown;
  ticks?: TickData[];
} {
  const useSubgraph = currencyA
    ? !CHAIN_IDS_MISSING_SUBGRAPH_DATA.includes(currencyA.chainId)
    : true;

  const tickLensTickData = useTicksFromTickLens(
    !useSubgraph ? currencyA : undefined,
    currencyB,
    feeAmount
  );

  const [skipNumber, setSkipNumber] = useState(0);
  const [subgraphTickData, setSubgraphTickData] = useState<Ticks>([]);
  const {
    data,
    error,
    loading: isLoading,
  } = useTicksFromSubgraph(
    useSubgraph ? currencyA : undefined,
    currencyB,
    feeAmount,
    skipNumber
  );

  useEffect(() => {
    if (data?.ticks.length) {
      if (skipNumber > 0) {
        setSubgraphTickData((tickData) => [...tickData, ...data.ticks]);
      } else {
        setSubgraphTickData([...data.ticks, ...data.ticks]);
      }
      if (data.ticks.length === MAX_THE_GRAPH_TICK_FETCH_VALUE) {
        setSkipNumber(
          (skipNumber) => skipNumber + MAX_THE_GRAPH_TICK_FETCH_VALUE
        );
      }
    }
  }, [data?.ticks]);

  return {
    //@ts-ignore
    isLoading: useSubgraph
      ? isLoading || data?.ticks.length === MAX_THE_GRAPH_TICK_FETCH_VALUE
      : tickLensTickData.isLoading,
    error: useSubgraph ? error : tickLensTickData.isError,
    ticks: useSubgraph ? subgraphTickData : tickLensTickData.tickData,
  };
}

export function usePoolActiveLiquidity(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined
): {
  isLoading: boolean;
  error: any;
  activeTick?: number;
  data?: TickProcessed[];
} {
  const pool = usePool(currencyA, currencyB, feeAmount);

  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = useMemo(() => {
    const currentTick = getActiveTick(pool[1]?.tickCurrent, feeAmount);
    if (currentTick && currentTick < -887272) return -887272;
    if (currentTick && currentTick > 887272) return 887272;
    return currentTick;
  }, [pool, feeAmount]);

  const { isLoading, error, ticks } = useAllV3Ticks(
    currencyA,
    currencyB,
    feeAmount
  );

  return useMemo(() => {
    if (
      !currencyA ||
      !currencyB ||
      activeTick === undefined ||
      pool[0] !== PoolState.EXISTS ||
      !ticks ||
      ticks.length === 0 ||
      isLoading
    ) {
      return {
        isLoading: isLoading || pool[0] === PoolState.LOADING,
        error,
        activeTick,
        data: undefined,
      };
    }

    const token0 = currencyA?.wrapped;
    const token1 = currencyB?.wrapped;

    // find where the active tick would be to partition the array
    // if the active tick is initialized, the pivot will be an element
    // if not, take the previous tick as pivot
    const pivotIndex = ticks && ticks.length > 20 ? 1 : 0;
    const pivot = ticks.findIndex(({ tick }) => tick > activeTick) - pivotIndex;

    if (pivot < 0) {
      // consider setting a local error
      console.error("TickData pivot not found");
      return {
        isLoading,
        error,
        activeTick,
        data: undefined,
      };
    }

    const activeTickProcessed: TickProcessed = {
      liquidityActive: JSBI.BigInt(pool[1]?.liquidity ?? 0),
      tick: activeTick,
      liquidityNet:
        Number(ticks[pivot].tick) === activeTick
          ? JSBI.BigInt(ticks[pivot].liquidityNet)
          : JSBI.BigInt(0),
      price0: tickToPrice(token0, token1, activeTick).toFixed(
        PRICE_FIXED_DIGITS
      ),
    };

    const subsequentTicks = computeSurroundingTicks(
      token0,
      token1,
      activeTickProcessed,
      ticks,
      pivot,
      true
    );

    const previousTicks = computeSurroundingTicks(
      token0,
      token1,
      activeTickProcessed,
      ticks,
      pivot,
      false
    );

    const ticksProcessed = previousTicks
      .concat(activeTickProcessed)
      .concat(subsequentTicks);

    return {
      isLoading,
      error,
      activeTick,
      data: ticksProcessed,
    };
  }, [currencyA, currencyB, activeTick, pool, ticks, isLoading, error]);
}
