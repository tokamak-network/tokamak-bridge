import { Flex, Text, Box } from "@chakra-ui/layout";
import TokenSymbolPair from "@/components/ui/TokenSymbolPair";

export default function IncreaseLiquidityModal() {
  return (
    <Flex w="364px" h="218px" py="16px" px="20px">
      {" "}
      <Flex alignItems={"center"}>
        <TokenSymbolPair
          tokenType1={"ETH"}
          tokenType2={"USDC"}
          network="Ethereum"
        />
        <Text fontWeight="bold" fontSize="23px">
          {/* {props.in.symbol} / {props.out.symbol} */}
          ETH / USDC
        </Text>
        {/* <Text fontSize={"12px"}>{props.slippage}</Text> */}
        <Flex bgColor={"#1F2128"} borderRadius={8} p={1} ml={2}>
          <Text fontSize={"12px"} as="b">
            {"0.30%"}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
