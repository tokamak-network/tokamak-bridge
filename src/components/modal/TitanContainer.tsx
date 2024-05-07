import { Flex, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FullWithTx } from "@/types/activity/history";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { fetchMarketPrice } from "@/utils/price/fetchMarketPrice";
import Image from "next/image";
import useMediaView from "@/hooks/mediaView/useMediaView";
import TitanHalfRounded from "assets/tokens/titan_half_rounded.svg";
import { TokenSymbol } from "../image/TokenSymbol";
import TokenSymbolWithNetwork from "../image/TokenSymbolWithNetwork";
import commafy from "@/utils/trim/commafy";

type TxType = FullWithTx & {
  inTokenAmount: string;
  inTokenSymbol: string;
};

const TitanContainer = (props: { tx: TxType }) => {
  const { tx } = props;
  const { inToken } = useInOutTokens();
  const [usdPrice, setUsdPrice] = useState(0);
  const { mode } = useGetMode();
  const { mobileView, pcView } = useMediaView();

  useEffect(() => {
    const getUsdPrice = async () => {
      const marketPrice = await fetchMarketPrice(
        tx ? tx.inTokenSymbol : (inToken?.tokenName as string)
      );
      if (marketPrice) setUsdPrice(marketPrice);
    };
    getUsdPrice();
  }, [inToken, tx]);
  return (
    <Flex
      pos={"relative"}
      bg="transparent"
      w={{ base: "full", lg: "176px" }}
      pt={{ base: "26px", lg: "30px" }}
      pb={"24px"}
      // justifyContent={"center"}
      h={{ base: "148px", lg: "172px" }}
      border={"1px solid #313442"}
      borderRadius={"12px"}
      flexDir={"column"}
      alignItems={"center"}
    >
      {mobileView && (
        <Flex
          pos={"absolute"}
          top={"0px"}
          right={"0px"}
          w={"34px"}
          h={"34px"}
          borderRadius={"0px 9px 0px 9px"}
          bg={"#2E3140"}
          justify={"center"}
          align={"center"}
          zIndex={100}
        >
          <Flex w={"28px"} h={"28px"} borderRadius={"0px 6px 0px 6px"}>
            <Image alt="eth" src={TitanHalfRounded} />
          </Flex>
        </Flex>
      )}
      {mobileView ? (
        <TokenSymbol
          tokenType={inToken?.tokenSymbol ?? "default"}
          w={mobileView ? 48 : 56}
          h={mobileView ? 48 : 56}
        />
      ) : (
        <TokenSymbolWithNetwork
          tokenSymbol={tx ? tx.inTokenSymbol : (inToken?.tokenSymbol as string)}
          chainId={55004}
          symbolW={56}
          symbolH={56}
          networkSymbolH={20}
          networkSymbolW={20}
        />
      )}

      <Flex
        fontSize={{ base: 17, lg: 18 }}
        fontWeight={600}
        columnGap={"8px"}
        h={"24px"}
        mt={"10px"}
      >
        <Text fontWeight={600}>
          {commafy(tx?.inTokenAmount || inToken?.parsedAmount, 2)}{" "}
        </Text>
        <Text fontWeight={400}>
          {tx?.inTokenSymbol || inToken?.tokenSymbol}
        </Text>
      </Flex>
      <Text
        h="21px"
        mt={"3px"}
        fontSize={"14px"}
        fontWeight={600}
        color={"#A0A3AD"}
      >
        ${" "}
        {inToken?.tokenSymbol && usdPrice !== undefined
          ? commafy(Number(usdPrice) * Number(inToken?.parsedAmount), 2)
          : "0.00"}
      </Text>
    </Flex>
  );
};

export default TitanContainer;
