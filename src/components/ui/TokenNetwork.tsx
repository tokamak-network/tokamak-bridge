import { Flex } from "@chakra-ui/layout";
import { TokenSymbol, NetworkSymbol } from "../image/TokenSymbol";

type TokenNetworkSymbolProps = {
  w?: number;
  h?: number;
  w2?: number;
  h2?: number;
  groupWidth?: number;
  tokenType?: string;
  network?: string;
};

export default function TokenNetworkSymbol(props: TokenNetworkSymbolProps) {
  const { w, h, network, tokenType, groupWidth, h2, w2 } = props;

  return (
    <Flex>
      {tokenType && network && (
        <Flex position={"relative"} w={groupWidth ? `${groupWidth}px` : "32px"}>
          <TokenSymbol w={w ? w : 32} h={h ? h : 32} tokenType={tokenType} />
          <Flex position={"absolute"} bottom={0} right={0}>
            <NetworkSymbol
              w={w2 ? w2 : 12}
              h={h2 ? h2 : 12}
              networkType={network}
            />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
