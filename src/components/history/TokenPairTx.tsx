import { Flex, Text } from "@chakra-ui/react";
import TokenSymbolWithNetwork from "../image/TokenSymbolWithNetwork";
import ARROW_ICON from "assets/icons/toast/toastArrow.svg";
import Image from "next/image";
import commafy from "@/utils/trim/commafy";
import { TokenSymbol } from "../image/TokenSymbol";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { trimAmount } from "@/utils/trim";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { FullWithTx } from "@/types/activity/history";
import { format, fromUnixTime } from "date-fns";

import Ethereum from "assets/icons/network/Ethereum_no_border.svg";
import Titan from "assets/icons/network/Titan_no_border.svg";
import Arrow from "assets/icons/arrow.svg";

export default function TokenPairTx(props: {
  inAmount: string;
  outAmount: string;
  inTokenSymbol: string;
  outTokenSymbol: string;
  action: string;
  tx?: FullWithTx;
}) {
  const { inAmount, outAmount, inTokenSymbol, outTokenSymbol, action, tx } =
    props;
  const { inToken } = useInOutTokens();

  return (
    <Flex
      justifyContent={"space-between"}
      w="100%"
      bg="#0F0F12"
      border={"1px solid #1F2128"}
      px="12px"
      py="4px"
      alignItems={"center"}
      borderRadius={"8px"}
    >
      <Flex columnGap={2} align={"center"}>
        <TokenSymbol tokenType={inTokenSymbol} w={24} h={24} />
        <Flex flexDir={"column"} justify={"space-between"}>
          <Text textColor={"#A0A3AD"} fontSize={9}>
            {inTokenSymbol}
          </Text>
          <Flex align={"center"}>
            <Text fontSize={12} fontWeight={400}>
              {trimAmount(inAmount, 8)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      {/* <Flex columnGap={"8px"}>
        <TokenSymbolWithNetwork
          tokenSymbol={inTokenSymbol}
          chainId={action === "withdraw" ? 5050 : 1}
        />
        <Image src={ARROW_ICON} alt={"ARROW_ICON"} />
        <TokenSymbolWithNetwork
          tokenSymbol={outTokenSymbol}
          chainId={action === "withdraw" ? 1 : 5050}
        />
      </Flex> */}

      <Flex>
        {/* <Text fontSize={"12px"} color={"fff"}>
          {commafy(inAmount, 2)} {inTokenSymbol}
        </Text> */}
        {tx?.l2txHash ? (
          <Flex fontSize={"11px"}>
            <Text color={"#FFFFFF"}>
              {format(fromUnixTime(Number(tx?.l2timeStamp)), "yyyy.MM.dd")}
            </Text>
            <Text ml="3px" color={"#A0A3AD"}>
              {format(fromUnixTime(Number(tx?.l2timeStamp)), "hh:mm b (z)")}
            </Text>
          </Flex>
        ) : (
          <Flex columnGap={1} align={"center"}>
            <Image alt="ethereum" src={Ethereum} width={16} height={16} />
            <Image alt="arrow" src={Arrow} width={12} height={12} />
            <Image alt="titan" src={Titan} width={16} height={16} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
