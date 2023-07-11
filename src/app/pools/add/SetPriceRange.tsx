import { Button, Flex, Text } from "@chakra-ui/react";
import Title from "./components/Title";
import PriceInput from "./components/RangeInput";
import RangeInput from "./components/RangeInput";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
// import { usePoolPrice } from "@/hooks/pool/usePoolData";
import commafy from "@/utils/trim/commafy";
import { usePriceTickConversion } from "@/hooks/pool/usePoolData";

export default function SetPriceRange() {
  const { inToken, outToken } = useInOutTokens();
  const price = usePriceTickConversion();

  return (
    <Flex flexDir={"column"} rowGap={"15px"}>
      <Title title="Set Price Range" />
      <Text textAlign={"center"}>
        Current Price : {commafy(price?.currentPrice, 4)} {inToken?.tokenSymbol}{" "}
        per {outToken?.tokenSymbol}
      </Text>
      <Flex columnGap={"12px"}>
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
        _hover={{}}
        _active={{}}
      >
        Full Range
      </Button>
    </Flex>
  );
}
