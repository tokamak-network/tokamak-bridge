import { Flex, Text, Box } from "@chakra-ui/layout";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import { useCallback, useMemo } from "react";
import { RangeText } from "./ui";
import TokenSymbolPair from "./TokenSymbolPair";
import commafy from "@/utils/trim/commafy";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { usePricePair } from "@/hooks/price/usePricePair";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";
import { priceFormmater } from "@/utils/trim/priceFormatter";
import { useSwitchNetwork } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import { useRouter } from "next/navigation";

export type PoolCardDetail = {
  id: number;
  token0: Token;
  token1: Token;
  token0Amount: number;
  token0CollectedFee: string;
  token0MarketPrice: string;
  token1Amount: number;
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
  isClosed: boolean;
  token0Value: number;
  token1Value: number;
  feeValue: number;
  chainId: number;
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
    token0Value,
    token1Value,
    token0MarketPrice,
    token1MarketPrice,
    isClosed,
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
  const { totalMarketPrice } = usePricePair({
    token0Name: token0.name,
    token0Amount: token0FeeAmount,
    token1Name: token1.name,
    token1Amount: token1FeeAmount,
  });

  const { connectedChainId, otherLayerChainInfo } = useConnectedNetwork();
  const { switchNetworkAsync, isLoading, error } = useSwitchNetwork();
  const router = useRouter();

  const chainId = token0.chainId;
  const onClickToRoute = useCallback(async () => {
    if (chainId !== connectedChainId && otherLayerChainInfo) {
      const res = await switchNetworkAsync?.(otherLayerChainInfo.chainId);
      if (res && res.id === otherLayerChainInfo.chainId) {
        return router.push(`/pools/${id}`);
      }
    }
    return router.push(`/pools/${id}`);
  }, [chainId, connectedChainId, otherLayerChainInfo]);

  return (
    <Box onClick={() => onClickToRoute()}>
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
        borderRadius={"16px"}
        _hover={{
          border: "3px solid #007AFF",
        }}
        cursor={"pointer"}
      >
        <Flex justifyContent={"flex-end"}>
          <RangeText inRange={inRange} isClosed={isClosed} />
        </Flex>
        <Flex alignItems="left" justifyContent="flex-start" flexDir={"column"}>
          <Text fontWeight="semibold" fontSize="18px" h={"27px"}>
            {token1.symbol}{" "}
            <span style={{ fontSize: 13, fontWeight: 400 }}>/</span>{" "}
            {token0.symbol}
          </Text>
          <Text fontSize={"12px"} h={"18px"}>
            {feePercent}
          </Text>
        </Flex>
        <TokenSymbolPair
          token0={token0}
          token1={token1}
          style={{ marginTop: "12px" }}
        />
        <Flex direction="column" fontSize={"12px"} mt={"auto"} pr={"4px"}>
          <Flex justifyContent="space-between" h={"20px"}>
            <Text>{token0.symbol}</Text>
            <Text maxW={"120px"} textAlign={"right"} overflow={"hidden"}>
              {token0Amount < 0.001
                ? smallNumberFormmater(token0Amount)
                : commafy(token0Amount, 4)}{" "}
              <span style={{ color: "#A0A3AD" }}>
                {token0MarketPrice === undefined
                  ? "(NA)"
                  : `($${priceFormmater(token0Value)})`}
              </span>
            </Text>
          </Flex>
          <Flex justifyContent="space-between" h={"20px"}>
            <Text>{token1.symbol}</Text>
            <Text maxW={"120px"} textAlign={"right"} overflow={"hidden"}>
              {token1Amount < 0.001
                ? smallNumberFormmater(token1Amount)
                : commafy(token1Amount, 4)}{" "}
              <span style={{ color: "#A0A3AD" }}>
                {" "}
                {token1MarketPrice === undefined
                  ? "(NA)"
                  : `($${priceFormmater(token1Value)})`}
              </span>
            </Text>
          </Flex>
          <Flex justifyContent="space-between" h={"20px"}>
            <Text>Fees</Text>
            {token0MarketPrice && token1MarketPrice ? (
              <Text maxW={"120px"} textAlign={"right"} overflow={"hidden"}>
                ${commafy(totalMarketPrice, 2)}
              </Text>
            ) : (
              <Text color={"#A0A3AD"}>No market data</Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
