import CustomTooltip from "@/components/tooltip/CustomTooltip";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";
import { ATOM_manuallyInverted } from "@/recoil/pool/positions";
import { Box, Flex, Text } from "@chakra-ui/react";
import SWITCHBUTTON_IMAGE from "assets/icons/pool/switch.svg";
import SWITCHBUTTON_INFO_IMAGE from "assets/icons/pool/switch_info.svg";

import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import QUESTION_ICON from "assets/icons/questionGray.svg";
import usePreview from "@/hooks/modal/usePreviewModal";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";
import {
  initialPrice,
  maxPriceForAddModal,
  minPriceForAddModal,
} from "@/recoil/pool/setPoolPosition";
import { usePriceTickConversion } from "@/hooks/pool/usePoolData";
import commafy from "@/utils/trim/commafy";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useMemo } from "react";
import { tickToPrice } from "@uniswap/v3-sdk";
import { trimAmount } from "@/utils/trim";

export const PriceInfo = (props: { isMinPrice: boolean }) => {
  const { isMinPrice } = props;
  const { tokenPairForInfo, info } = usePositionInfo();
  const { priceLower, priceUpper, inverted, ticksAtLimit } = usePoolInfo();
  const { poolModal } = usePreview();

  const minPrice = useRecoilValue(minPriceForAddModal);
  const maxPrice = useRecoilValue(maxPriceForAddModal);
  const manuallyInverted = useRecoilValue(ATOM_manuallyInverted);

  const priceToAdd = useMemo(() => {
    if (info) {
      const minPrice = tickToPrice(info.token0, info.token1, info.tickLower);
      const maxPrice = tickToPrice(info.token0, info.token1, info.tickUpper);

      return {
        minPrice: manuallyInverted
          ? maxPrice.invert().toSignificant()
          : minPrice.toSignificant(),
        maxPrice: manuallyInverted
          ? minPrice.invert().toSignificant()
          : maxPrice.toSignificant(),
      };
    }
  }, [info, manuallyInverted]);

  const priceData =
    poolModal === "addLiquidity"
      ? isMinPrice
        ? priceToAdd?.minPrice
        : priceToAdd?.maxPrice
      : isMinPrice &&
        ((!inverted && ticksAtLimit?.LOWER) || (inverted && ticksAtLimit.UPPER))
      ? 0
      : !isMinPrice &&
        ((!inverted && ticksAtLimit?.UPPER) || (inverted && ticksAtLimit.LOWER))
      ? "∞"
      : isMinPrice
      ? priceLower?.toSignificant(6)
      : priceUpper?.toSignificant(6);

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
      <Flex justifyContent={"center"} alignItems={"center"} columnGap={"2px"}>
        <Text fontSize={12} fontWeight={400} color={"#A0A3AD"}>
          {isMinPrice ? "Min price" : "Max price"}
        </Text>
        <Box w={"18px"} h={"18px"} pt={"1px"}>
          <CustomTooltip
            content={<Image src={QUESTION_ICON} alt={"QUESTION_ICON"}></Image>}
            tooltipLabel={`Your position will be 100% ${
              isMinPrice
                ? inverted || manuallyInverted
                  ? tokenPairForInfo?.token1Symbol
                  : tokenPairForInfo?.token0Symbol
                : inverted || manuallyInverted
                ? tokenPairForInfo?.token0Symbol
                : tokenPairForInfo?.token1Symbol
            } at this price.`}
          />
        </Box>
      </Flex>
      <Text
        color={"#ffffff"}
        fontSize={20}
        fontWeight={500}
        maxH={"24px"}
        lineHeight={"24px"}
        verticalAlign={"center"}
      >
        {priceData === "0" || priceData === "∞"
          ? priceData
          : smallNumberFormmater(priceData?.toString(), undefined, true)}
      </Text>
      <Text fontSize={12} fontWeight={400} color={"#A0A3AD"}>
        {inverted || manuallyInverted
          ? tokenPairForInfo?.token0Symbol
          : tokenPairForInfo?.token1Symbol}{" "}
        per{" "}
        {inverted || manuallyInverted
          ? tokenPairForInfo?.token1Symbol
          : tokenPairForInfo?.token0Symbol}
      </Text>
    </Flex>
  );
};

export const CurrentPriceInfo = () => {
  const { tokenPairForInfo, info } = usePositionInfo();
  const { currentPrice, inverted } = usePoolInfo();
  const { invertPrice } = useV3MintInfo();

  const { poolModal } = usePreview();
  const price = usePriceTickConversion();
  const startingPrice = useRecoilState(initialPrice);

  const manuallyInverted = useRecoilValue(ATOM_manuallyInverted);

  const currentPriceToAdd = useMemo(() => {
    if (info) {
      const currentPrice = tickToPrice(
        info.token0,
        info.token1,
        info.tickCurrent
      );
      return manuallyInverted
        ? currentPrice.invert().toSignificant(info.token1.decimals)
        : currentPrice.toSignificant(info.token0.decimals);
    }
  }, [info, manuallyInverted]);

  return (
    <Flex
      w={"100%"}
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
        {poolModal === "addLiquidity"
          ? currentPriceToAdd
          : smallNumberFormmater(Number(currentPrice ?? 0))}
      </Text>

      <Text fontSize={12} fontWeight={400} color={"#A0A3AD"}>
        {manuallyInverted
          ? tokenPairForInfo?.token0Symbol
          : tokenPairForInfo?.token1Symbol}{" "}
        per{" "}
        {manuallyInverted
          ? tokenPairForInfo?.token1Symbol
          : tokenPairForInfo?.token0Symbol}
      </Text>
    </Flex>
  );
};

export function PriceRangeInfo() {
  //   const { isMinPrice } = props;

  const [manuallyInverted, setManuallyInverted] = useRecoilState(
    ATOM_manuallyInverted
  );
  const { poolModal } = usePreview();

  return (
    <Flex flexDir={"column"}>
      <Flex columnGap={"12px"} pos={"relative"}>
        <PriceInfo isMinPrice={true} />
        <Box
          pos={"absolute"}
          left={"45.5%"}
          top={"32px"}
          cursor={"pointer"}
          onClick={() => {
            setManuallyInverted(!manuallyInverted);
          }}
        >
          <Image
            src={
              poolModal === "addLiquidity"
                ? SWITCHBUTTON_IMAGE
                : SWITCHBUTTON_INFO_IMAGE
            }
            alt={"SWITCHBUTTON_IMAGE"}
          />
        </Box>
        <PriceInfo isMinPrice={false} />
      </Flex>
      <Flex justifyContent={"center"}>
        <CurrentPriceInfo />
      </Flex>
    </Flex>
  );
}
