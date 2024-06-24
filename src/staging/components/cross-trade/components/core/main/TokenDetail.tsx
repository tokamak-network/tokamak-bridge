import { Flex, Text, Box } from "@chakra-ui/react";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import { Token } from "@/staging/types/crossTrade";

interface TokenDetailProps {
  amount: string;
  symbol: string;
  detail: string;
  network?: number;
}

export default function TokenDetail(props: TokenDetailProps) {
  const { amount, symbol, detail, network } = props;
  const isProfit = network ? true : false;
  return (
    <Flex>
      {isProfit && (
        <TokenSymbolWithNetwork
          tokenSymbol={symbol}
          chainId={network}
          networkSymbolW={18}
          networkSymbolH={18}
          symbolW={32}
          symbolH={32}
        />
      )}
      <Box ml='10px'>
        <Flex alignItems={"center"}>
          <Text
            fontWeight={500}
            fontSize={"14px"}
            lineHeight={"21px"}
            color={"#FFFFFF"}
          >
            {amount}
          </Text>
          <Text
            ml={"4px"}
            fontWeight={400}
            fontSize={"14px"}
            lineHeight={"21px"}
            color={"#A0A3AD"}
          >
            {symbol}
          </Text>
        </Flex>
        <Flex alignItems={"center"}>
          <Text
            fontWeight={400}
            fontSize={"9px"}
            lineHeight={"13.5px"}
            color={"#A0A3AD"}
          >
            (
          </Text>
          <Text
            fontWeight={400}
            fontSize={"11px"}
            lineHeight={"16.5px"}
            color={"#A0A3AD"}
          >
            {isProfit ? `$${detail}` : `${detail}%`}
          </Text>
          <Text
            fontWeight={400}
            fontSize={"9px"}
            lineHeight={"13.5px"}
            color={"#A0A3AD"}
          >
            )
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
