import { NetworkSymbol } from "@/components/image/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { Box, Flex } from "@chakra-ui/react";
import { Token } from "@uniswap/sdk-core";
import { CSSProperties } from "react";

export default function TokenSymbolPair(props: {
  token0: Token;
  token1: Token;
  symbolSize?: number;
  style?: CSSProperties;
}) {
  const { token0, token1, symbolSize, style } = props;

  return (
    <Flex position="relative" justifyContent="center" style={style}>
      <Box pos={"absolute"} right={"70px"} zIndex={100}>
        <TokenSymbol
          tokenType={token0?.symbol as string}
          w={symbolSize ?? 64}
          h={symbolSize ?? 64}
        />
        <Box pos={"relative"} top={"-18px"} left={"43px"}>
          <NetworkSymbol
            network={token0?.chainId}
            w={24}
            h={24}
            style={{
              borderRadius: "4px",
              position: "absolute",
              right: 0,
            }}
            isCircle={false}
          />
        </Box>
      </Box>
      <Box pos={"absolute"} left={"70px"}>
        <TokenSymbol
          tokenType={token1?.symbol as string}
          w={symbolSize ?? 64}
          h={symbolSize ?? 64}
        />
        <Box pos={"relative"} top={"-18px"} left={"43px"}>
          <NetworkSymbol
            network={token1?.chainId}
            w={24}
            h={24}
            style={{
              borderRadius: "4px",
              position: "absolute",
              right: 0,
            }}
            isCircle={false}
          />
        </Box>
      </Box>
    </Flex>
  );
}
