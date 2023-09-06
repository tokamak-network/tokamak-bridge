import { Flex, Text, Box } from "@chakra-ui/layout";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import { useCallback, useMemo } from "react";
import { RangeText } from "./ui";
import TokenSymbolPair from "./TokenSymbolPair";
import commafy from "@/utils/trim/commafy";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";
import { priceFormmater } from "@/utils/trim/priceFormatter";
import { useSwitchNetwork } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import { useRouter } from "next/navigation";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import QUESTION_ICON from "assets/icons/questionGray.svg";
import Image from "next/image";
import { trimAmount } from "@/utils/trim";

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
  token0FeeValue: number;
  token1FeeValue: number;
  feeValue: number;
  chainId: number;
  owner: string;
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
    token0FeeValue,
    token1FeeValue,
    feeValue,
    chainId,
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

  const { connectedChainId, otherLayerChainInfo } = useConnectedNetwork();
  const { switchNetworkAsync, isLoading, error } = useSwitchNetwork();
  const router = useRouter();

  const onClickToRoute = useCallback(async () => {
    if (chainId !== connectedChainId && otherLayerChainInfo) {
      const res = await switchNetworkAsync?.(otherLayerChainInfo.chainId);
      if (res && res.id === otherLayerChainInfo.chainId) {
        return router.push(`/pools/${id}?chainId=${chainId}`);
      }
    }
    return router.push(`/pools/${id}?chainId=${chainId}`);
  }, [chainId, connectedChainId, otherLayerChainInfo]);

  const token0HasMarketPrice = Number(token0MarketPrice) > 0;
  const token1HasMarketPrice = Number(token1MarketPrice) > 0;
  const token0FeeValueForTooltip = token0HasMarketPrice
    ? `($${commafy(token0FeeValue, 2, undefined, "0.00")})`
    : "";
  const token1FeeValueForTooltip = token1HasMarketPrice
    ? `($${commafy(token1FeeValue, 2, undefined, "0.00")})`
    : "";

  return (
    <Box onClick={() => onClickToRoute()}>
      <Flex
        flexDir="column"
        borderWidth={"3px"}
        borderColor={
          chainId === 55004 || chainId === 5050 ? "#05274C" : "#383736"
        }
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
          token0={token1}
          token1={token0}
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
                {token0MarketPrice === undefined || token0Value === 0
                  ? undefined
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
                {token1MarketPrice === undefined || token1Value === 0
                  ? undefined
                  : `($${priceFormmater(token1Value)})`}
              </span>
            </Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems={"center"} h={"20px"}>
            <Text>Fees</Text>
            <Flex columnGap={"5px"}>
              {token0MarketPrice && token1MarketPrice ? (
                <Text maxW={"120px"} textAlign={"right"} overflow={"hidden"}>
                  ${commafy(feeValue, 2)}
                </Text>
              ) : (
                <Text color={"#A0A3AD"}>No market data</Text>
              )}
              <Flex w={"14px"} h={"18px"} alignItems={"center"}>
                <CustomTooltip
                  content={<Image src={QUESTION_ICON} alt={"QUESTION_ICON"} />}
                  tooltipLabel={
                    <Flex
                      w={
                        token0HasMarketPrice && token1HasMarketPrice
                          ? "300px"
                          : "260px"
                      }
                      px={"10px"}
                      pos={"absolute"}
                      zIndex={500}
                      h={"28px"}
                      bg={"#383A49"}
                      textAlign={"center"}
                      right={"-125px"}
                      borderRadius={"4px"}
                      justifyContent={"center"}
                    >
                      <Text w={"100%"} pos={"relative"}>
                        FEES :{" "}
                        {`${trimAmount(token0CollectedFee.toString(), 7)} ${
                          token0.symbol
                        } ${token0FeeValueForTooltip}`}{" "}
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            color: "##A0A3AD",
                          }}
                        >
                          +
                        </span>{" "}
                        {`${trimAmount(token1CollectedFee.toString(), 7)} ${
                          token1.symbol
                        } ${token1FeeValueForTooltip}`}{" "}
                      </Text>
                    </Flex>
                  }
                  style={{ width: "10px" }}
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
