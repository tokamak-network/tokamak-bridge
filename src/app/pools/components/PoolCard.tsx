import { NetworkSymbol } from "@/components/image/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { Flex, Text, Box } from "@chakra-ui/layout";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import { useMemo } from "react";

export type PoolCardDetail = {
  id: number;
  token0: Token;
  token1: Token;
  fee: FeeAmount;
  inRange: boolean;
};

export default function PoolCard(props: PoolCardDetail) {
  const { id, token0, token1, fee, inRange } = props;

  const feePercent = useMemo(() => {
    switch (fee) {
      case 100:
        return "0.01%";
      case 500:
        return "0.05%";
      case 3000:
        return "0.3%";
      case 10000:
        return "1%";
      default:
        return null;
    }
  }, [fee]);

  return (
    <Flex
      flexDir="column"
      border="3px solid #383736"
      bgColor={!props.id ? "#15161D" : ""}
      w="200px"
      h="248px"
      paddingTop={"12px"}
      paddingBottom={"16px"}
      paddingLeft={"16px"}
      paddingRight={"12px"}
      borderRadius={"12px"}
      _hover={{
        border: "3px solid #007AFF",
      }}
      cursor={"pointer"}
    >
      <Flex alignItems="center" justifyContent="flex-end">
        <Box
          w="6px"
          h="6px"
          borderRadius="50%"
          bg={inRange ? "#00EE98" : "#DD3A44"}
          mr="6px"
        />
        <Text
          fontSize="11px"
          fontWeight="600"
          color={inRange ? "#00EE98" : "#DD3A44"}
        >
          {inRange ? "In Range" : "Out Range"}
        </Text>
      </Flex>

      <Flex alignItems="left" justifyContent="flex-start" flexDir={"column"}>
        <Text fontWeight="semibold" fontSize="18px" h={"27px"}>
          {token0.symbol} / {token1.symbol}
        </Text>
        <Text fontSize={"12px"} h={"18px"}>
          {feePercent}
        </Text>
      </Flex>
      <Flex position="relative" justifyContent="center" mt={"19px"}>
        <Box pos={"absolute"} right={"70px"} zIndex={100}>
          <TokenSymbol tokenType={token0.symbol as string} w={64} h={64} />
          <Box pos={"relative"} top={"-18px"} left={"43px"}>
            <NetworkSymbol
              network={token0.chainId}
              w={20}
              h={20}
              style={{
                borderRadius: "4px",
                position: "absolute",
                right: 0,
              }}
            />
          </Box>
        </Box>
        <Box pos={"absolute"} left={"70px"}>
          <TokenSymbol tokenType={token1.symbol as string} w={64} h={64} />
          <Box pos={"relative"} top={"-18px"} left={"43px"}>
            <NetworkSymbol
              network={token1.chainId}
              w={20}
              h={20}
              style={{
                borderRadius: "4px",
                position: "absolute",
                right: 0,
              }}
            />
          </Box>
        </Box>
      </Flex>
      <Flex direction="column" fontSize={"12px"} mt={"auto"} pr={"4px"}>
        <Flex justifyContent="space-between">
          <Text>{token0.symbol}</Text>
          <Text>{0.0084} ($1.25)</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{token1.symbol}</Text>
          <Text>{0.0084} ($1.25)</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Earnings</Text>
          <Text>${3.18}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
