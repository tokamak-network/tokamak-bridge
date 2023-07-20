import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import REMOVE_ICON from "assets/icons/removeIcon.svg";
import ADD_ICON from "assets/icons/addIcon.svg";
import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import commafy from "@/utils/trim/commafy";
import { useRangeHopCallbacks } from "@/hooks/pool/useV3Hooks";
import { useRecoilState } from "recoil";
import {
  atMaxTick,
  atMinTick,
  maxPrice,
  minPrice,
} from "@/recoil/pool/setPoolPosition";
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
  const { pricesAtTicks, ticksAtLimit } = useV3MintInfo();

  const [minPriceInput, setMinPrice] = useRecoilState(minPrice);
  const [maxPriceInput, setMaxPrice] = useRecoilState(maxPrice);

  const [, setAtMinTick] = useRecoilState(atMinTick);
  const [, setAtMaxTick] = useRecoilState(atMaxTick);

  const [valueInThisInput, setValueInThisInput] = useState<string | undefined>(
    undefined
  );

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replaceAll(",", "");
      const inputValue = value ?? "0";
      setValueInThisInput(inputValue);
      return isMinPrice ? setMinPrice(inputValue) : setMaxPrice(inputValue);
    },
    [isMinPrice]
  );

  const onFocusHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsFocused(true);
      const value = e.target.value.replaceAll(",", "");
      const inputValue = value ?? "0";

      return isMinPrice ? setMinPrice(inputValue) : setMaxPrice(inputValue);
    },
    [isMinPrice]
  );

  const blurHandler = useCallback(() => {
    setIsFocused(false);
    if (pricesAtTicks) {
      setValueInThisInput(
        isMinPrice
          ? pricesAtTicks?.LOWER?.toSignificant(5)
          : pricesAtTicks?.UPPER?.toSignificant(5)
      );
      return isMinPrice
        ? setMinPrice(pricesAtTicks?.LOWER?.toSignificant(5))
        : setMaxPrice(pricesAtTicks?.UPPER?.toSignificant(5));
    }
  }, [pricesAtTicks, isMinPrice]);

  const inputValue = useMemo(() => {
    if (ticksAtLimit.LOWER && isMinPrice) return "0";
    if (ticksAtLimit.UPPER && !isMinPrice) return "∞";
    return isMinPrice ? commafy(minPriceInput, 5) : commafy(maxPriceInput, 5);
  }, [isMinPrice, ticksAtLimit, minPriceInput, maxPriceInput]);

  useEffect(() => {
    if (Number(minPriceInput?.replaceAll(",", "")) !== 0) {
      setAtMinTick(false);
    } else {
      setAtMinTick(true);
    }

    if (maxPriceInput !== "∞") {
      return setAtMaxTick(false);
    } else {
      return setAtMaxTick(true);
    }
  }, [minPriceInput, maxPriceInput]);

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
            onClick={
              ticksAtLimit.LOWER
                ? () => {}
                : isMinPrice
                ? onDecreaseLower
                : onDecreaseUpper
            }
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
            onChange={onChangeHandler}
            textAlign={"center"}
            onBlur={blurHandler}
            onFocus={onFocusHandler}
            value={isFocused ? valueInThisInput : inputValue}
            // value={inputValue}
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
