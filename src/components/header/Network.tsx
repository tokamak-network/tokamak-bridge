import { Box, Center } from "@chakra-ui/layout";
import ImageSymbol, {
  SupportedImageSymbol,
} from "@/componenets/image/ImageSymbol";

export default function Network() {
  return (
    <Center className="header-right-common" w={"48px"} h={"48px"}>
      <SupportedImageSymbol tokenType="ETH" w={24} h={24} />
    </Center>
  );
}
