import { Flex } from "@chakra-ui/layout";
import Swap from "./Swap";
import Modals from "./Modals";
import { Details } from "./Details";

export default function BridgeSwap() {
  return (
    <Flex flexDir={"column"} w={"496px"} h={"100%"}>
      {/* <Flex mb={"auto"}>
        <SelectCardButton field="OUTPUT" />
      </Flex> */}
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        w={"100%"}
        h={"100%"}
      >
        <Swap />
        <Details />
      </Flex>
      <Modals />
    </Flex>
  );
}
