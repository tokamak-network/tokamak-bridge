import { NetworkSymbol } from "@/components/image/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { Flex, Text, Box } from "@chakra-ui/layout";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import Link from "next/link";
import { useMemo } from "react";
import { RangeText } from "./ui";
import TokenSymbolPair from "./TokenSymbolPair";
import commafy from "@/utils/trim/commafy";

export type PoolCardDetail = {
  id: number;
  token0: Token;
  token1: Token;
  token0Amount: string;
  token0CollectedFee: string;
  token0MarketPrice: string;
  token1Amount: string;
  token1CollectedFee: string;
  token1MarketPrice: string;
  fee: FeeAmount;
  inRange: boolean;
};

export default function PoolCard(props: PoolCardDetail) {
  const { id, token0, token1, fee, inRange, token0Amount, token1Amount } =
    props;

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
    <Link href="/pools/[info]" as={`/pools/${id}`} key={id}>
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
        <RangeText inRange={inRange} />
        <Flex alignItems="left" justifyContent="flex-start" flexDir={"column"}>
          <Text fontWeight="semibold" fontSize="18px" h={"27px"}>
            {token0.symbol} / {token1.symbol}
          </Text>
          <Text fontSize={"12px"} h={"18px"}>
            {feePercent}
          </Text>
        </Flex>
        <TokenSymbolPair token0={token0} token1={token1} />
        <Flex direction="column" fontSize={"12px"} mt={"auto"} pr={"4px"}>
          <Flex justifyContent="space-between">
            <Text>{token0.symbol}</Text>
            <Text>{commafy(token0Amount, 4)} ($1.25)</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>{token1.symbol}</Text>
            <Text>{commafy(token1Amount, 4)} ($1.25)</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Earnings</Text>
            <Text>${3.18}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
}
