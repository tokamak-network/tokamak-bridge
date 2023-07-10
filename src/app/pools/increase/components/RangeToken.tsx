import { Flex, Text } from "@chakra-ui/react";
import commafy from "@/utils/trim/commafy";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import { TokenInfo } from "@/types/token/supportedToken";

export default function RangeToken(props: {
  token: TokenInfo;
  amount: string;
  style?: {};
  page: string;
  alterAmount: string
}) {
  const { token, amount, style, page, alterAmount} = props;
  return (
    <Flex width={"100%"} justifyContent={"space-between"} {...props.style}>
      <Flex>
        <TokenSymbolWithNetwork
          tokenSymbol={token.tokenSymbol as string}
          chainId={1}
          symbolW={24}
          symbolH={24}
          networkSymbolH={13}
          networkSymbolW={13}
          bottom={-1}
          right={-1}
        />
        <Text ml="8px">{token.tokenSymbol}</Text>
      </Flex>
      <Flex>
        <Text>{amount}</Text>
        <Text ml={'6px'}>{page === "Remove" ? "-" : "+"}</Text>
        <Text>{alterAmount}</Text>
      </Flex>
    </Flex>
  );
}
