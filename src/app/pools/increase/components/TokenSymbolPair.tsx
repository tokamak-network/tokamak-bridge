import { NetworkSymbol } from "@/components/image/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { ATOM_collectWethOption } from "@/recoil/pool/positions";
import { Box, Flex } from "@chakra-ui/react";
import { Token } from "@uniswap/sdk-core";
import { CSSProperties } from "react";
import { useRecoilValue } from "recoil";

export default function TokenSymbolPair(props: {
  token0: Token;
  token1: Token;
  symbolSize?: number;
  marginTop?: string;
  networkSymbolSize?: number;
  networkSymbolStyle?: CSSProperties;
}) {
  const {
    token0,
    token1,
    symbolSize,
    marginTop,
    networkSymbolSize,
    networkSymbolStyle,
  } = props;

  const collectAsWETH = useRecoilValue(ATOM_collectWethOption);

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
            token1?.symbol === "ETH"
              ? collectAsWETH
                ? "WETH"
                : "ETH"
              : (token1?.symbol as string)
          }
          w={symbolSize ?? 64}
          h={symbolSize ?? 64}
        />
        <Box
          pos={"relative"}
          top={"-18px"}
          left={"43px"}
          style={networkSymbolStyle}
        >
          <NetworkSymbol
            network={token0.chainId}
            w={networkSymbolSize ?? 20}
            h={networkSymbolSize ?? 20}
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
            token0?.symbol === "ETH"
              ? collectAsWETH
                ? "WETH"
                : "ETH"
              : (token0?.symbol as string)
          }
          w={symbolSize ?? 64}
          h={symbolSize ?? 64}
        />
        <Box
          pos={"relative"}
          top={"-18px"}
          left={"43px"}
          style={networkSymbolStyle}
        >
          <NetworkSymbol
            network={token0.chainId}
            w={networkSymbolSize ?? 20}
            h={networkSymbolSize ?? 20}
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
