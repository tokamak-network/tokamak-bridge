import CustomTooltip from "@/components/tooltip/CustomTooltip";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";
import { ATOM_manuallyInverted } from "@/recoil/pool/positions";
import { Box, Container, Flex, Text } from "@chakra-ui/react";
import SWITCHBUTTON_IMAGE from "assets/icons/pool/switch.svg";
import SWITCHBUTTON_INFO_IMAGE from "assets/icons/pool/switch_info.svg";

import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import QUESTION_ICON from "assets/icons/question.svg";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import usePreview from "@/hooks/modal/usePreviewModal";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";

export const PriceInfo = (props: { isMinPrice: boolean }) => {
  const { isMinPrice } = props;
  const { tokenPairForInfo } = usePositionInfo();
  const { priceLower, priceUpper, inverted, ticksAtLimit } = usePoolInfo();

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
        <Box w={"18px"} h={"18px"}>
          <CustomTooltip
            content={<Image src={QUESTION_ICON} alt={"QUESTION_ICON"}></Image>}
            tooltipLabel={`Your position will be 100% ${
              isMinPrice
                ? inverted
                  ? tokenPairForInfo?.token1Symbol
                  : tokenPairForInfo?.token0Symbol
                : inverted
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
        {isMinPrice &&
        ((!inverted && ticksAtLimit?.LOWER) || (inverted && ticksAtLimit.UPPER))
          ? 0
          : !isMinPrice &&
            ((!inverted && ticksAtLimit?.UPPER) ||
              (inverted && ticksAtLimit.LOWER))
          ? "∞"
          : isMinPrice
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

export const CurrentPriceInfo = () => {
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
        {smallNumberFormmater(Number(currentPrice ?? 0))}
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

  const [manuallyInverted, setManuallyInverted] = useRecoilState(
    ATOM_manuallyInverted
  );
  const { invertTokenPair } = useInOutTokens();
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
            invertTokenPair();
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
