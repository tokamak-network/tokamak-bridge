import { Button, Flex, Text } from "@chakra-ui/react";
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

export default function SetPriceRange() {
  const { inToken, outToken } = useInOutTokens();
  const price = usePriceTickConversion();
  const { getSetFullRange } = useRangeHopCallbacks();
  const [poolStatus, pool] = usePool();
  const { firstStepPassed, priceInitialized } = useAddLiquidityCondition();

  return (
    <Flex
      flexDir={"column"}
      // rowGap={"15px"}
      opacity={firstStepPassed && priceInitialized ? 1 : 0.3}
    >
      <Title title="Set Price Range" />
      {poolStatus !== PoolState.NOT_EXISTS && price?.currentPrice && (
        <Text textAlign={"center"} my={"16px"}>
          Current Price : {commafy(price?.currentPrice, 4)}{" "}
          {outToken?.tokenSymbol} per {inToken?.tokenSymbol}
        </Text>
      )}
      <Flex columnGap={"12px"} mb={"12px"}>
        <RangeInput isMinPrice={true} />
        <RangeInput isMinPrice={false} />
      </Flex>
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
    </Flex>
  );
}
