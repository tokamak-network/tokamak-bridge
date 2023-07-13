import { Flex, Text } from "@chakra-ui/react";
import TokenSymbolWithNetwork from "../image/TokenSymbolWithNetwork";
import ARROW_ICON from "assets/icons/toast/toastArrow.svg";
import Image from "next/image";
export default function TokenPairTx(props: { inAmount: string }) {
  const { inAmount } = props;
  return (
    <Flex justifyContent={"space-between"} w="100%" bg='#0F0F12' border={'1px solid #1F2128'} px='12px' py='8px' alignItems={'center'} borderRadius={'8px'}>
      <Flex columnGap={"8px"}>
        <TokenSymbolWithNetwork tokenSymbol={"ETH"} chainId={5050} />
        <Image src={ARROW_ICON} alt={"ARROW_ICON"} />
        <TokenSymbolWithNetwork tokenSymbol={"ETH"} chainId={1} />
      </Flex>

      <Flex>
        <Text fontSize={'12px'}>{inAmount} ETH to {inAmount} ETH</Text> 
      </Flex>
    </Flex>
  );
}
