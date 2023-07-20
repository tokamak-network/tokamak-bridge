import { Box, Flex } from "@chakra-ui/react";
import { TokenSymbol } from "./TokenSymbol";
import { NetworkSymbol } from "./NetworkSymbol";

type TokenSymbolWithNetworkProp = {
  tokenSymbol: string;
  chainId: number;
  symbolW?: number;
  symbolH?: number;
  networkSymbolW?: number;
  networkSymbolH?: number;
};

export default function TokenSymbolWithNetwork(
  props: TokenSymbolWithNetworkProp
) {
  const {
    tokenSymbol,
    chainId,
    symbolW,
    symbolH,
    networkSymbolW,
    networkSymbolH,
  } = props;  
  return (
    <Flex position={"relative"}>
      <TokenSymbol
        w={symbolW ?? 32}
        h={symbolH ?? 32}
        tokenType={tokenSymbol}
      />
      <Box
        w={"16px"}
        h={"16px"}
        pos={"absolute"}
        // bgColor={inNetwork.nativeToken === "TON" ? "#fff" : "#383736"}
        // borderRadius={"2px"}
        // border={"2px solid #1F2128"}
        bottom={"-2px"}
        right={"-2px"}
      >
        <NetworkSymbol
          w={networkSymbolW ?? 14}
          h={networkSymbolH ?? 14}
          network={chainId}
        />
      </Box>
    </Flex>
  );
}
