import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import REMOVE_ICON from "assets/icons/removeIcon.svg";
import ADD_ICON from "assets/icons/addIcon.svg";

import Image from "next/image";
import commafy from "@/utils/trim/commafy";
import { useRangeHopCallbacks } from "@/hooks/pool/useV3Hooks";
import { useRecoilState } from "recoil";
import { maxPrice, minPrice } from "@/recoil/pool/setPoolPosition";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { useCallback } from "react";

type RangeInputProps = {
  isMinPrice: boolean;
};

export default function RangeInput(props: RangeInputProps) {
  const { isMinPrice } = props;
  const { inToken, outToken } = useInOutTokens();
  const { onDecreaseLower, onIncreaseLower, onDecreaseUpper, onIncreaseUpper } =
    useRangeHopCallbacks();
  const { pricesAtTicks } = useV3MintInfo();

  const [minPriceInput, setMinPrice] = useRecoilState(minPrice);
  const [maxPriceInput, setMaxPrice] = useRecoilState(maxPrice);

  const blurHandler = useCallback(() => {
    if (pricesAtTicks) {
      return isMinPrice
        ? setMinPrice(pricesAtTicks?.LOWER?.toSignificant(5))
        : setMaxPrice(pricesAtTicks?.UPPER?.toSignificant(5));
    }
  }, [pricesAtTicks, isMinPrice]);

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
        <Flex mt={"11px"} mb={"7px"} columnGap={"16px"} alignItems={"center"}>
          <Flex
            w={"32px"}
            h={"32px"}
            border={"1px solid #313442"}
            borderRadius={"8px"}
            bgColor={"#15161D"}
            justifyContent={"center"}
            alignItems={"center"}
            cursor={"pointer"}
            onClick={isMinPrice ? onDecreaseLower : onDecreaseUpper}
          >
            <Image src={REMOVE_ICON} alt={"REMOVE_ICON"} />
          </Flex>
          <Input
            w={"65px"}
            h={"24px"}
            border={"none"}
            borderColor={"transparent !important"}
            p={0}
            _focus={{
              boxShadow: "none !important",
              borderColor: "transparent !important",
            }}
            boxShadow={"none !important"}
            fontSize={20}
            fontWeight={500}
            onChange={(e) => {
              const value = e.target.value.replaceAll(",", "");
              isMinPrice ? setMinPrice(value) : setMaxPrice(value);
            }}
            onBlur={blurHandler}
            value={
              isMinPrice ? commafy(minPriceInput, 5) : commafy(maxPriceInput, 5)
            }
          >
            {/* {isMinPrice ? commafy(minPriceInput, 5) : commafy(maxPriceInput, 5)} */}
          </Input>
          <Flex
            w={"32px"}
            h={"32px"}
            border={"1px solid #313442"}
            borderRadius={"8px"}
            bgColor={"#15161D"}
            justifyContent={"center"}
            alignItems={"center"}
            cursor={"pointer"}
            onClick={isMinPrice ? onIncreaseLower : onIncreaseUpper}
          >
            <Image src={ADD_ICON} alt={"ADD_ICON"} />
          </Flex>
        </Flex>
        <Text fontSize={12} fontWeight={500} color={"#A0A3AD"}>
          {outToken?.tokenSymbol} per {inToken?.tokenSymbol}
        </Text>
      </Flex>
    </Flex>
  );
}
