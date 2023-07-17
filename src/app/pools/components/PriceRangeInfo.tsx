import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";
import { Box, Container, Flex, Text } from "@chakra-ui/react";
import SWITCHBUTTON_IMAGE from "assets/icons/pool/switch.svg";
import Image from "next/image";

const PriceInfo = (props: { isMinPrice: boolean }) => {
  const { isMinPrice } = props;
  const { tokenPairForInfo } = usePositionInfo();
  const { priceLower, priceUpper, inverted } = usePoolInfo();

  return (
    <Flex
      w={"186px"}
      py={"10px"}
      border={"1px solid #313442"}
      borderRadius={"12px"}
      justifyContent={"center"}
      flexDir={"column"}
      rowGap={"8px"}
    >
      <Text fontSize={12} fontWeight={400} color={"#A0A3AD"}>
        {isMinPrice ? "Min price" : "Max price"}
      </Text>
      <Text
        color={"#ffffff"}
        fontSize={20}
        fontWeight={500}
        maxH={"24px"}
        lineHeight={"24px"}
        verticalAlign={"center"}
      >
        {isMinPrice
          ? priceLower?.toSignificant(5)
          : priceUpper?.toSignificant(5)}
      </Text>
      <Text fontSize={12} fontWeight={400} color={"#A0A3AD"}>
        {inverted
          ? tokenPairForInfo?.token0Symbol
          : tokenPairForInfo?.token1Symbol}{" "}
        per{" "}
        {inverted
          ? tokenPairForInfo?.token1Symbol
          : tokenPairForInfo?.token0Symbol}
      </Text>
    </Flex>
  );
};

const CurrentPriceInfo = () => {
  const { tokenPairForInfo } = usePositionInfo();
  const { currentPrice, inverted } = usePoolInfo();
  return (
    <Flex
      w={"186px"}
      py={"10px"}
      borderRadius={"12px"}
      justifyContent={"center"}
      flexDir={"column"}
      rowGap={"8px"}
    >
      <Text fontSize={12} fontWeight={400} color={"#A0A3AD"}>
        Current Price
      </Text>
      <Text
        color={"#ffffff"}
        fontSize={20}
        fontWeight={500}
        maxH={"24px"}
        lineHeight={"24px"}
        verticalAlign={"center"}
      >
        {currentPrice}
      </Text>
      <Text fontSize={12} fontWeight={400} color={"#A0A3AD"}>
        {inverted
          ? tokenPairForInfo?.token0Symbol
          : tokenPairForInfo?.token1Symbol}{" "}
        per{" "}
        {inverted
          ? tokenPairForInfo?.token1Symbol
          : tokenPairForInfo?.token0Symbol}
      </Text>
    </Flex>
  );
};

export function PriceRangeInfo() {
  //   const { isMinPrice } = props;
  return (
    <Flex flexDir={"column"}>
      <Flex columnGap={"12px"} pos={"relative"}>
        <PriceInfo isMinPrice={true} />
        <Box pos={"absolute"} left={"176px"} top={"32px"} cursor={"pointer"}>
          <Image src={SWITCHBUTTON_IMAGE} alt={"SWITCHBUTTON_IMAGE"} />
        </Box>
        <PriceInfo isMinPrice={false} />
      </Flex>
      <Flex justifyContent={"center"}>
        <CurrentPriceInfo />
      </Flex>
    </Flex>
  );
}
