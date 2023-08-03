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
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { usePricePair } from "@/hooks/price/usePricePair";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";

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
  liquidity: string;
  sqrtPriceX96: string;
  tickLower: number;
  tickCurrent: number;
  tickUpper: number;
  rawPositionInfo: any;
  hasETH: boolean;
};

export default function PoolCard(props: PoolCardDetail) {
  const {
    id,
    token0,
    token1,
    fee,
    inRange,
    token0Amount,
    token1Amount,
    token0CollectedFee,
    token1CollectedFee,
  } = props;

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

  const token0FeeAmount = Number(commafy(token0CollectedFee, 8, true));
  const token1FeeAmount = Number(commafy(token1CollectedFee, 8, true));
  const { token0Price, token1Price, hasTokenPrice } = usePricePair({
    token0Name: token0.name,
    token0Amount: Number(commafy(token0Amount, 4).replaceAll(",", "")),
    token1Name: token1.name,
    token1Amount: Number(commafy(token1Amount, 4).replaceAll(",", "")),
  });

  const { totalMarketPrice } = usePricePair({
    token0Name: token0.name,
    token0Amount: token0FeeAmount,
    token1Name: token1.name,
    token1Amount: token1FeeAmount,
  });

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
            {token1.symbol} / {token0.symbol}
          </Text>
          <Text fontSize={"12px"} h={"18px"}>
            {feePercent}
          </Text>
        </Flex>
        <TokenSymbolPair token0={token0} token1={token1} />
        <Flex direction="column" fontSize={"12px"} mt={"auto"} pr={"4px"}>
          <Flex justifyContent="space-between">
            <Text>{token0.symbol}</Text>
            <Text>
              {smallNumberFormmater(commafy(token0Amount, 4))}{" "}
              <span style={{ color: "#A0A3AD" }}>
                {token0Price && `($${token0Price})`}
              </span>
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>{token1.symbol}</Text>
            <Text>
              {smallNumberFormmater(commafy(token1Amount, 4))}{" "}
              <span style={{ color: "#A0A3AD" }}>
                {" "}
                {token1Price && `($${token1Price})`}
              </span>
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Earnings</Text>
            {hasTokenPrice ? (
              <Text>${commafy(totalMarketPrice, 2)}</Text>
            ) : (
              <Text color={"#A0A3AD"}>No market data</Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
}
