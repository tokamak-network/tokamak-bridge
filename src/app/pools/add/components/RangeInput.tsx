import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { Box, Flex, Text } from "@chakra-ui/react";
import REMOVE_ICON from "assets/icons/removeIcon.svg";
import ADD_ICON from "assets/icons/addIcon.svg";

import Image from "next/image";
import { usePriceTickConversion } from "@/hooks/pool/usePoolData";

type RangeInputProps = {
  isMinPrice: boolean;
};

export default function RangeInput(props: RangeInputProps) {
  const { isMinPrice } = props;
  const { inToken, outToken } = useInOutTokens();
  const { minPrice, maxPrice } = usePriceTickConversion();

  return (
    <Flex flexDir={"column"}>
      <Flex
        w={"186px"}
        h={"109px"}
        bgColor={"#1F2128"}
        borderRadius={"12px"}
        pt={"10px"}
        px={"12px"}
        pb={"13px"}
        alignItems={"center"}
        flexDir={"column"}
      >
        <Text fontSize={12} fontWeight={400} color={"#A0A3AD"}>
          {isMinPrice ? "Min price" : "Max price"}
        </Text>
        <Flex mt={"11px"} mb={"7px"} columnGap={"16px"}>
          <Flex
            w={"32px"}
            h={"32px"}
            border={"1px solid #313442"}
            borderRadius={"8px"}
            bgColor={"#15161D"}
            justifyContent={"center"}
            alignItems={"center"}
            cursor={"pointer"}
          >
            <Image src={REMOVE_ICON} alt={"REMOVE_ICON"} />
          </Flex>
          <Text fontSize={20} fontWeight={500}>
            {isMinPrice ? minPrice : maxPrice}
          </Text>
          <Flex
            w={"32px"}
            h={"32px"}
            border={"1px solid #313442"}
            borderRadius={"8px"}
            bgColor={"#15161D"}
            justifyContent={"center"}
            alignItems={"center"}
            cursor={"pointer"}
          >
            <Image src={ADD_ICON} alt={"ADD_ICON"} />
          </Flex>
        </Flex>
        <Text fontSize={12} fontWeight={500} color={"#A0A3AD"}>
          {inToken?.tokenSymbol} per {outToken?.tokenSymbol}
        </Text>
      </Flex>
    </Flex>
  );
}
