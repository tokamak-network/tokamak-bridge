import { Flex, Text } from "@chakra-ui/react";
import { RangeText } from "../../components/ui";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import { convertFeeToPercent } from "@/utils/pool/convertFeeToPercent";
import { PoolCardDetail } from "../../components/PoolCard";

export default function InfoTitle(props: { info: PoolCardDetail | undefined }) {
  const { info } = props;

  if (!info) return null;
  const token0 = info.token0;
  const token1 = info.token1;
  const { fee } = info;

  return (
    <Flex justifyContent={"space-between"} w={"100%"}>
      <Flex columnGap={"8px"}>
        <Flex alignItems={"center"}>
          <TokenSymbolWithNetwork
            tokenSymbol={token1.symbol as string}
            chainId={token1.chainId}
            symbolW={24}
            symbolH={24}
            networkSymbolH={12}
            networkSymbolW={12}
            bottom={"-2px"}
            style={{ zIndex: 10 }}
          />
          <TokenSymbolWithNetwork
            tokenSymbol={token0.symbol as string}
            chainId={token0.chainId}
            symbolW={24}
            symbolH={24}
            networkSymbolH={12}
            networkSymbolW={12}
            bottom={"-2px"}
            style={{ left: "-8px" }}
          />
        </Flex>
        <Flex alignItems={"center"} columnGap={"8px"}>
          <Text fontWeight="bold" fontSize="23px">
            {token1.symbol} / {token0.symbol}
          </Text>
          <Flex bgColor={"#1F2128"} borderRadius={8} p={1}>
            <Text fontSize={"12px"} as="b">
              {convertFeeToPercent(fee)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <RangeText
        inRange={info?.inRange ?? false}
        isClosed={info.isClosed}
        style={{ fontSize: 14 }}
      />
    </Flex>
  );
}
