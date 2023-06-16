import { TokenInfo } from "@/types/token/supportedToken";
import { Flex, Text, Box } from "@chakra-ui/layout";
import { FeeAmount } from "@uniswap/v3-sdk";
import Image from "next/image";

type PoolCardDetail = {
  id: number;
  token0: TokenInfo;
  token1: TokenInfo;
  fee: FeeAmount;
  range: boolean;
};

export default function PoolTile(props: PoolCardDetail) {
  const { id, token0, token1, fee, range } = props;

  return (
    <Flex
      flexDir="column"
      border="3px solid #383736"
      bgColor={!props.id ? "#15161D" : ""}
      w="200px"
      h="248px"
      paddingTop={"12px"}
      paddingBottom={"22px"}
      paddingLeft={"16px"}
      paddingRight={"16px"}
      borderRadius={"16px"}
      _hover={{
        border: "1px solid #007AFF",
      }}
    >
      <Flex alignItems="center" justifyContent="flex-end">
        <Box
          w="6px"
          h="6px"
          borderRadius="50%"
          bg={range ? "#00EE98" : "#DD3A44"}
          mr="6px"
        />
        <Text
          fontSize="11px"
          fontWeight="600"
          color={range ? "#00EE98" : "#DD3A44"}
        >
          {range ? "In Range" : "Out Range"}
        </Text>
      </Flex>

      <Flex alignItems="left" justifyContent="flex-start" flexDir={"column"}>
        <Text fontWeight="semibold" fontSize="18px">
          {token0.tokenSymbol} / {token1.tokenSymbol}
        </Text>
        <Text fontSize={"12px"}>{fee}</Text>
      </Flex>
      <Flex
        position="relative"
        alignItems="center"
        textAlign="center"
        left="20px"
      ></Flex>
      <Flex
        direction="column"
        fontSize={"12px"}
        marginTop={"95px"}
        line-height={"20px"}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold">{props.in}</Text>
          <Text marginLeft="2">{props.trade.inputAmount} ($1.25)</Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold">{props.out}</Text>
          <Text marginLeft="2">{props.trade.outTokenAmount} ($1.25)</Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold">Earnings</Text>
          <Text marginLeft="2">${props.trade.gasFee}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
