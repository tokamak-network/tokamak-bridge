import { Flex } from "@chakra-ui/layout";
import TokenNetwork from "@/components/ui/TokenNetwork";

type TokenNetworkSymbolProps = {
  w?: number;
  h?: number;
  w2?: number;
  h2?: number;
  tokenType1?: string;
  tokenType2?: string;
  network?: string;
};

export default function TokenNetworkSymbol(props: TokenNetworkSymbolProps) {
  const { w, h, network, tokenType1, tokenType2 } = props;

  return (
    <>
      <Flex position={"relative"} zIndex={2}>
        <TokenNetwork tokenType={tokenType1} network={network} />
      </Flex>
      <Flex position={"relative"} left="-8px" zIndex={1}>
        <TokenNetwork tokenType={tokenType2} network={network} />
      </Flex>
    </>
  );
}
