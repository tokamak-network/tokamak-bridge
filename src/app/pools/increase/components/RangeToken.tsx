import { Flex, Text } from "@chakra-ui/react";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import { Token } from "@uniswap/sdk-core";
import { T_PoolModal } from "@/recoil/modal/atom";
import { ATOM_collectWethOption } from "@/recoil/pool/positions";
import { useRecoilValue } from "recoil";

export default function RangeToken(props: {
  token: Token;
  amount: string | undefined;
  style?: {};
  page: T_PoolModal;
  alterAmount: string | undefined;
}) {
  const { token, amount, style, page, alterAmount } = props;
  const collectAsWETH = useRecoilValue(ATOM_collectWethOption);

  return (
    <Flex width={"100%"} justifyContent={"space-between"} {...props.style}>
      <Flex>
        <TokenSymbolWithNetwork
          tokenSymbol={
            token?.symbol === "ETH"
              ? collectAsWETH
                ? "WETH"
                : "ETH"
              : (token?.symbol as string)
          }
          chainId={token.chainId}
          symbolW={24}
          symbolH={24}
          networkSymbolH={13}
          networkSymbolW={13}
          bottom={-1}
          right={-1}
        />
        <Text ml="8px">
          {token?.symbol === "ETH"
            ? collectAsWETH
              ? "WETH"
              : "ETH"
            : token?.symbol}
        </Text>
      </Flex>
      <Flex>
        <Text color={"#A0A3AD"}>{amount}</Text>
        <Text ml={"6px"}>
          {!alterAmount || page === "addLiquidity" || alterAmount === "-"
            ? ""
            : page === "removeLiquidity"
            ? "-"
            : "+"}
        </Text>
        <Text>{alterAmount === "-" ? undefined : alterAmount}</Text>
      </Flex>
    </Flex>
  );
}
