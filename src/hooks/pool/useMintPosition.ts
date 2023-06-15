import { ethers } from "ethers";
import {
  FeeAmount,
  computePoolAddress,
  MintOptions,
  nearestUsableTick,
  NonfungiblePositionManager,
  Pool,
  Position,
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

export default function useMintPosition() {
  const { mode } = useGetMode();
  const { inToken, outToken } = useInOutTokens();
  const { UNISWAP_CONTRACT } = useContract();
  const { layer } = useConnectedNetwork();
  const { provider } = useProvier();
  const { address } = useAccount();

  const getPoolInfo = useCallback(async () => {
    if (mode === "Pool" && inToken && outToken) {
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
  }, [mode, inToken, outToken]);

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

  const mintPosition = useCallback(async () => {
    if (mode === "Pool" && inToken && outToken && address) {
      const positionToMint = await constructPosition(
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
  }, [provider, inToken, outToken, address, UNISWAP_CONTRACT]);

  return { mintPosition };
}
