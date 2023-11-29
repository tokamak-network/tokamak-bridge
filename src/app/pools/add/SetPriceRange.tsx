import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Title from "./components/Title";
import RangeInput from "./components/RangeInput";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
// import { usePoolPrice } from "@/hooks/pool/usePoolData";
import commafy from "@/utils/trim/commafy";
import { usePriceTickConversion } from "@/hooks/pool/usePoolData";
import { useRangeHopCallbacks } from "@/hooks/pool/useV3Hooks";
import { usePool } from "@/hooks/pool/usePool";
import { PoolState } from "@/types/pool/pool";
import { useAddLiquidityCondition } from "@/hooks/pool/useAddLiquidityCondition";
import useIsTon from "@/hooks/token/useIsTon";
import ChartWrapper from "./components/ChartWrapper";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { useRecoilState } from "recoil";
import { maxPrice, minPrice } from "@/recoil/pool/setPoolPosition";
import { TICK_SPACINGS } from "@uniswap/v3-sdk";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import Image from "next/image";
import { CurrentPriceTooltip } from "../components/CurrentPriceTooltip";

export default function SetPriceRange() {
  const { inToken, outToken } = useInOutTokens();
  const { currentPrice } = usePriceTickConversion();
  const { getSetFullRange } = useRangeHopCallbacks();
  const [poolStatus, pool] = usePool();
  const { firstStepPassed, priceInitialized } = useAddLiquidityCondition();
  const { isTONatPair } = useIsTon();
  const isActive = firstStepPassed && priceInitialized && !isTONatPair;

  //for chart
  const {
    ticksAtLimit,
    pricesAtTicks,
    noLiquidity,
    price: priceInfo,
    invertPrice,
    fee,
    ticks,
    invalidRange,
  } = useV3MintInfo();
  const [, setMinPrice] = useRecoilState(minPrice);
  const [, setMaxPrice] = useRecoilState(maxPrice);

  //need to disabled interactive
  //when maxTick >= minTick
  const interactive =
    !noLiquidity ||
    (fee &&
    ticks["LOWER"] &&
    ticks["LOWER"] + TICK_SPACINGS[fee] === ticks["UPPER"]
      ? true
      : false);
  const disabled = invalidRange;

  return (
    <Flex
      flexDir={"column"}
      // rowGap={"15px"}
      opacity={isActive ? 1 : 0.3}
      style={{ pointerEvents: isActive ? "all" : "none" }}
    >
      <ChartWrapper
        currencyA={pool?.token0}
        currencyB={pool?.token1}
        feeAmount={pool?.fee}
        ticksAtLimit={ticksAtLimit}
        price={
          priceInfo
            ? parseFloat(
                (invertPrice ? priceInfo.invert() : priceInfo).toSignificant(8)
              )
            : undefined
        }
        priceLower={pricesAtTicks["LOWER"]}
        priceUpper={pricesAtTicks["UPPER"]}
        onLeftRangeInput={setMinPrice}
        onRightRangeInput={setMaxPrice}
        interactive={interactive}
        disabled={disabled}
      />
      {poolStatus !== PoolState.NOT_EXISTS && currentPrice && (
        <Flex justifyContent={"center"} columnGap={"4px"} alignItems={"center"}>
          <Text textAlign={"center"} mt={"24px"} mb={"16px"}>
            Current Price : {commafy(currentPrice, 4)} {outToken?.tokenSymbol}{" "}
            per {inToken?.tokenSymbol}
          </Text>
          <CurrentPriceTooltip style={{ marginTop: "5px" }} />
        </Flex>
      )}
      <Flex
        columnGap={"12px"}
        mb={"12px"}
        mt={poolStatus === PoolState.NOT_EXISTS ? "24px" : ""}
      >
        <RangeInput isMinPrice={true} />
        <RangeInput isMinPrice={false} />
      </Flex>
      {/* {poolStatus !== PoolState.NOT_EXISTS && (
        <Button
          w={"100%"}
          minH={"32px"}
          maxH={"32px"}
          border={"1px solid #313442"}
          borderRadius={"8px"}
          bg={"transparent"}
          fontSize={14}
          fontWeight={500}
          _hover={{ borderColor: "#fff" }}
          _active={{}}
          onClick={getSetFullRange}
        >
          Full Range
        </Button>
      )} */}
    </Flex>
  );
}
