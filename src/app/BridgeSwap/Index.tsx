import { Flex } from "@chakra-ui/layout";
import Swap from "./Swap";
import Modals from "../Modals";
import { Details } from "./Details";
import MaintenanceBanner from "@/components/modal/MaintenanceBanner";
import RelayBanner from "@/components/modal/RelayBanner";
export default function BridgeSwap() {
  return (
    <Flex flexDir={"column"} w={"496px"} h={"100%"}>
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        w={"100%"}
        h={"100%"}
      >
          <RelayBanner/>
        <MaintenanceBanner/>
      
        <Swap />
        <Details />
      </Flex>
      {/* <Modals /> */}
    </Flex>
  );
}
