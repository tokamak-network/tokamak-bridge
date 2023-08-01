import { Flex, Text } from "@chakra-ui/react";
import { RangeText } from "../../components/ui";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";
import { convertFeeToPercent } from "@/utils/pool/convertFeeToPercent";

export default function InfoTitle() {
  const { info } = usePositionInfo();
  const { inverted } = usePoolInfo();

  if (!info) return null;
  const token0 = inverted ? info.token1 : info.token0;
  const token1 = inverted ? info.token0 : info.token1;
  const { fee } = info;

  return (
    <Flex justifyContent={"space-between"} w={"100%"}>
      <Flex columnGap={"8px"}>
        <Flex>
          <TokenSymbolWithNetwork
            tokenSymbol={token1.symbol as string}
            chainId={token1.chainId}
            symbolW={32}
            symbolH={32}
            networkSymbolH={12}
            networkSymbolW={12}
            bottom={1}
            style={{ zIndex: 10 }}
          />
          <TokenSymbolWithNetwork
            tokenSymbol={token0.symbol as string}
            chainId={token0.chainId}
            symbolW={32}
            symbolH={32}
            networkSymbolH={12}
            networkSymbolW={12}
            bottom={1}
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
      <RangeText inRange={info?.inRange ?? false} />
    </Flex>
  );
}
