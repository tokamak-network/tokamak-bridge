import { Box, Center } from "@chakra-ui/layout";
import ImageSymbol, { TokenSymbol } from "@/components/image/TokenSymbol";

export default function Network() {
  return (
    <Center className="header-right-common" w={"48px"} h={"48px"}>
      <TokenSymbol tokenType="ETH" w={24} h={24} />
    </Center>
  );
}
