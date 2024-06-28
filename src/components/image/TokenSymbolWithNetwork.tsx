import { Box, Flex, SystemCSSProperties, border } from "@chakra-ui/react";
import { TokenSymbol } from "./TokenSymbol";
import { NetworkSymbol } from "./NetworkSymbol";
import { CSSProperties } from "react";

type TokenSymbolWithNetworkProp = {
  tokenSymbol: string;
  chainId: number | undefined;
  symbolW?: number;
  symbolH?: number;
  networkSymbolW?: number;
  networkSymbolH?: number;
  bottom?: number | string;
  right?: number | string;
  style?: {};
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
    bottom,
    right,
    style,
  } = props;

  return (
    <Flex position={"relative"} {...style}>
      <TokenSymbol
        w={symbolW ?? 32}
        h={symbolH ?? 32}
        tokenType={tokenSymbol}
      />
      <Flex
        pos={"absolute"}
        // bgColor={inNetwork.nativeToken === "TON" ? "#fff" : "#383736"}
        // borderRadius={"2px"}
        bottom={bottom ?? "3.8px"}
        right={right ?? "-1.5"}
        justify={"flex-end"}
        alignItems={"end"}
      >
        <NetworkSymbol
          w={networkSymbolW ?? 14}
          h={networkSymbolH ?? 14}
          network={chainId}
        />
      </Flex>
    </Flex>
  );
}
