import { NetworkSymbol } from "@/components/image/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";
import { Box, Flex } from "@chakra-ui/react";
import { Token } from "@uniswap/sdk-core";

export default function TokenSymbolPair(props: {
  token0: Token;
  token1: Token;
  symbolSize?: number;
  marginTop?: string;
}) {
  const { token0, token1, symbolSize, marginTop } = props;
  const { inverted } = usePoolInfo();

  return (
    <Flex
      position="relative"
      justifyContent="center"
      mt={marginTop ?? "19px"}
      w="100%"
      height={"64px"}
    >
      <Box pos={"absolute"} left={"105px"} zIndex={100} height={"100%"}>
        <TokenSymbol
          tokenType={
            inverted ? (token1?.symbol as string) : (token0?.symbol as string)
          }
          w={symbolSize ?? 64}
          h={symbolSize ?? 64}
        />
        <Box pos={"relative"} top={"-18px"} left={"43px"}>
          <NetworkSymbol
            network={token0.chainId}
            w={20}
            h={20}
            style={{
              borderRadius: "4px",
              position: "absolute",
              right: 0,
            }}
          />
        </Box>
      </Box>
      <Box pos={"absolute"} left={"155px"}>
        <TokenSymbol
          tokenType={
            inverted ? (token0?.symbol as string) : (token1?.symbol as string)
          }
          w={symbolSize ?? 64}
          h={symbolSize ?? 64}
        />
        <Box pos={"relative"} top={"-18px"} left={"43px"}>
          <NetworkSymbol
            network={token0.chainId}
            w={20}
            h={20}
            style={{
              borderRadius: "4px",
              position: "absolute",
              right: 0,
            }}
          />
        </Box>
      </Box>
    </Flex>
  );
}
