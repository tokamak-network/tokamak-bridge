import { Flex, Text } from "@chakra-ui/react";
import { RangeText } from "./ui";
import TokenSymbolPair from "../increase/components/TokenSymbolPair";
import RangeToken from "../increase/components/RangeToken";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import commafy from "@/utils/trim/commafy";
import { useRemoveLiquidity } from "@/hooks/pool/useLiquidity";
import { convertFeeToPercent } from "@/utils/pool/convertFeeToPercent";

export default function Range(props: { page: string; style?: {} }) {
  const { page, style } = props;

  const { info } = usePositionInfo();

  if (!info) return null;

  const { token0, token1, inRange, token0Amount, token1Amount, fee } = info;
  const { amount0Removed, amount1Removed } = useRemoveLiquidity();

  return (
    <Flex
      w="364px"
      borderRadius={"12px"}
      border={"3px solid #383736"}
      px="20px"
      py="16px"
      flexDir={"column"}
      {...style}
    >
      <Flex justifyContent={"space-between"} w="100%" h="36px">
        <Flex alignItems={"center"}>
          <Text fontWeight="bold" fontSize="23px">
            {token0.symbol} / {token1.symbol}
          </Text>
          <Flex bgColor={"#1F2128"} borderRadius={8} p={1} ml={2}>
            <Text fontSize={"12px"} as="b">
              {convertFeeToPercent(fee)}
            </Text>
          </Flex>
        </Flex>
        <RangeText inRange={inRange} />
      </Flex>
      <Flex justifyContent={"center"} w="100%">
        <TokenSymbolPair
          token0={token0}
          token1={token1}
          //   symbolSize={32}
          marginTop="12px"
        />
      </Flex>
      <RangeToken
        token={token0}
        amount={commafy(token0Amount, 6)}
        style={{ marginBottom: "9px", marginTop: "14px" }}
        page={page}
        alterAmount={amount0Removed ? commafy(amount0Removed, 6) : ""}
      />
      <RangeToken
        token={token1}
        amount={commafy(token1Amount, 6)}
        page={page}
        alterAmount={amount1Removed ? commafy(amount1Removed, 6) : ""}
      />
      <Flex flexDir={"column"} mt="10px">
        <Flex h="1px" borderBottom={"1px solid #2E313A"}></Flex>
        <Flex mt="8px" justifyContent={"space-between"}>
          <Text fontSize={"14px"}>Estimated gas fees</Text>
          <Text fontSize={"16px"} fontWeight={500}>
            $4.44
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
