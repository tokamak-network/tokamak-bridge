import { Flex, Text } from "@chakra-ui/react";
import TokenSymbolWithNetwork from "../image/TokenSymbolWithNetwork";
import ARROW_ICON from "assets/icons/toast/toastArrow.svg";
import Image from "next/image";
import commafy from "@/utils/trim/commafy";

export default function TokenPairTx(props: {
  inAmount: string;
  outAmount: string;
  inTokenSymbol: string;
  outTokenSymbol: string;
  action: string;
}) {
  const { inAmount, outAmount, inTokenSymbol, outTokenSymbol, action } = props;
  return (
    <Flex
      justifyContent={"space-between"}
      w="100%"
      bg="#0F0F12"
      border={"1px solid #1F2128"}
      px="12px"
      py="8px"
      alignItems={"center"}
      borderRadius={"8px"}
    >
      <Flex columnGap={"8px"}>
        <TokenSymbolWithNetwork
          tokenSymbol={inTokenSymbol}
          chainId={action === "withdraw" ? 55004 : 1}
        />
        <Image src={ARROW_ICON} alt={"ARROW_ICON"} />
        <TokenSymbolWithNetwork
          tokenSymbol={outTokenSymbol}
          chainId={action === "withdraw" ? 1 : 55004}
        />
      </Flex>

      <Flex>
        <Text fontSize={"12px"} color={"fff"}>
          {commafy(inAmount, 2)} {inTokenSymbol}
        </Text>
      </Flex>
    </Flex>
  );
}
