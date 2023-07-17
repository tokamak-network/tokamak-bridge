import { Flex, Text } from "@chakra-ui/react";
import { RangeText } from "../../components/ui";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import TokenSymbolPair from "../../components/TokenSymbolPair";

export default function InfoTitle() {
  const { info } = usePositionInfo();

  if (!info) return null;
  return (
    <Flex justifyContent={"space-between"} w={"100%"}>
      <Flex alignItems={"center"}>
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
