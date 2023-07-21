import { Flex, Text } from "@chakra-ui/react";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import { Token } from "@uniswap/sdk-core";
import { T_PoolModal } from "@/recoil/modal/atom";

export default function RangeToken(props: {
  token: Token;
  amount: string;
  style?: {};
  page: T_PoolModal;
  alterAmount: string | undefined;
}) {
  const { token, amount, style, page, alterAmount } = props;

  return (
    <Flex width={"100%"} justifyContent={"space-between"} {...props.style}>
      <Flex>
        <TokenSymbolWithNetwork
          tokenSymbol={token.symbol as string}
          chainId={1}
          symbolW={24}
          symbolH={24}
          networkSymbolH={13}
          networkSymbolW={13}
          bottom={-1}
          right={-1}
        />
        <Text ml="8px">{token.symbol}</Text>
      </Flex>
      <Flex>
        <Text color={"#A0A3AD"}>{amount}</Text>
        <Text ml={"6px"}>
          {!alterAmount ? "" : page === "removeLiquidity" ? "-" : "+"}
        </Text>
        <Text>{alterAmount}</Text>
      </Flex>
    </Flex>
  );
}
