import { Flex, Text } from "@chakra-ui/react";
import { RangeText } from "../../components/ui";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";

export default function InfoTitle() {
  const { info } = usePositionInfo();

  return (
    <Flex justifyContent={"space-between"}>
      <Flex alignItems={"center"}>
        {/* <TokenSymbolPair
              token0={info.token0}
              token1={info.token1}
              symbolSize={32}
            /> */}
        <Text fontWeight="bold" fontSize="23px">
          {info?.token0.symbol} / {info?.token1.symbol}
        </Text>
        <Flex bgColor={"#1F2128"} borderRadius={8} p={1} ml={2}>
          <Text fontSize={"12px"} as="b">
            {"0.30%"}
          </Text>
        </Flex>
      </Flex>
      <RangeText inRange={info?.inRange ?? false} />
    </Flex>
  );
}
