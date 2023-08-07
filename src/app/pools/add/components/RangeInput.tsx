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
  const { pricesAtTicks, ticksAtLimit, invertPrice, pricesAtLimit } =
    useV3MintInfo();

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
      setAtMinTick(false);
      setAtMaxTick(false);
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
    },
    []
  );

  const blurHandler = useCallback(() => {
    setIsFocused(false);
    if (pricesAtTicks) {
      setValueInThisInput(
        isMinPrice
          ? invertPrice
            ? pricesAtTicks?.UPPER?.invert().toSignificant(5)
            : pricesAtTicks?.LOWER?.toSignificant(5)
          : invertPrice
          ? pricesAtTicks?.LOWER?.invert().toSignificant(5)
          : pricesAtTicks?.UPPER?.toSignificant(5)
      );
      return isMinPrice
        ? setMinPrice(
            invertPrice
              ? pricesAtTicks?.UPPER?.invert().toSignificant(5)
              : pricesAtTicks?.LOWER?.toSignificant(5)
          )
        : setMaxPrice(
            invertPrice
              ? pricesAtTicks?.LOWER?.invert().toSignificant(5)
              : pricesAtTicks?.UPPER?.toSignificant(5)
          );
    }
  }, [pricesAtTicks, isMinPrice, , invertPrice]);

  const inputValue = useMemo(() => {
    if ((invertPrice ? ticksAtLimit.UPPER : ticksAtLimit.LOWER) && isMinPrice)
      return "0";
    if (ticksAtLimit.UPPER && !isMinPrice) return "∞";
    return isMinPrice
      ? commafy(minPriceInput, 5, true, true)
      : commafy(maxPriceInput, 5, true, true);
  }, [isMinPrice, ticksAtLimit, minPriceInput, maxPriceInput, invertPrice]);

  // useEffect(() => {
  //   if (minPriceInput?.replaceAll(",", "") !== pricesAtLimit["LOWER"]) {
  //     invertPrice ? setAtMaxTick(false) : setAtMinTick(false);
  //   } else {
  //     invertPrice ? setAtMaxTick(true) : setAtMinTick(true);
  //   }

  //   if (maxPriceInput !== "∞") {
  //     return invertPrice ? setAtMinTick(false) : setAtMaxTick(false);
  //   } else {
  //     return invertPrice ? setAtMinTick(true) : setAtMaxTick(true);
  //   }
  // }, [minPriceInput, maxPriceInput, invertPrice, pricesAtLimit]);

  console.log("gogo");

  console.log(valueInThisInput, inputValue);

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
                ? invertPrice
                  ? onIncreaseUpper
                  : onDecreaseLower
                : invertPrice
                ? onIncreaseLower
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
            placeholder="0"
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
            onClick={
              isMinPrice
                ? invertPrice
                  ? onDecreaseUpper
                  : onIncreaseLower
                : invertPrice
                ? onDecreaseLower
                : onIncreaseUpper
            }
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
