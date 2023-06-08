import { Flex } from "@chakra-ui/layout";
import { TokenSymbol, NetworkSymbol } from "../image/TokenSymbol";

type TokenNetworkSymbolProps = {
  w?: number;
  h?: number;
  w2?: number;
  h2?: number;
  tokenType?: string;
  network?: string;
};

export default function TokenNetworkSymbol(props: TokenNetworkSymbolProps) {
  const { w, h, network, tokenType } = props;

  return (
    <Flex>
      {tokenType && network && (
        <Flex position={"relative"}>
          <TokenSymbol w={w ? w : 32} h={h ? h : 32} tokenType={tokenType} />
          <Flex position={"absolute"} bottom={0} right={0}>
            <NetworkSymbol
              w={w ? w : 12}
              h={h ? h : 12}
              networkType={network}
            />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
