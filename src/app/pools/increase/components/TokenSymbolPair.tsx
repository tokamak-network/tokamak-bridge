import { NetworkSymbol } from "@/components/image/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { Box, Flex } from "@chakra-ui/react";
import { Token } from "@uniswap/sdk-core";
import { TokenInfo } from "types/token/supportedToken";

export default function TokenSymbolPair(props: {
  token0: TokenInfo;
  token1: TokenInfo;
  symbolSize?: number;
  marginTop?: string
}) {
  const { token0, token1, symbolSize, marginTop } = props;

  return (
    <Flex position="relative" justifyContent="center" mt={marginTop??"19px"} w='100%' height={'64px'}>
      <Box pos={"absolute"} left={"105px"} zIndex={100} height={'100%'}>
        <TokenSymbol
          tokenType={token0?.tokenSymbol as string}
          w={symbolSize ?? 64}
          h={symbolSize ?? 64}
        />
        <Box pos={"relative"} top={"-18px"} left={"43px"}>
          <NetworkSymbol
            network={1}
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
      <Box pos={"absolute"}  left={'155px'}>
        <TokenSymbol
          tokenType={token1?.tokenSymbol as string}
          w={symbolSize ?? 64}
          h={symbolSize ?? 64}
        />
        <Box pos={"relative"}  top={"-18px"} left={"43px"}>
          <NetworkSymbol
            network={1}
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
