import { Box, Center } from "@chakra-ui/layout";
import ImageSymbol, { TokenSymbol } from "@/components/image/TokenSymbol";
import { NetworkSymbol } from "../image/NetworkSymbol";
import useConnectedNetwork from "@/hooks/network";

export default function Network() {
  const { connectedChainId } = useConnectedNetwork();
  return (
    <Center className="header-right-common" w={"48px"} h={"48px"}>
      <NetworkSymbol
        network={connectedChainId ?? 1}
        w={24}
        h={24}
        isCircle={true}
      />
    </Center>
  );
}
