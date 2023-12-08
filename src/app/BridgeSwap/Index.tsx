import { Flex } from "@chakra-ui/layout";
import Swap from "./Swap";
import { Details } from "./Details";
import MaintenanceBanner from "@/components/modal/MaintenanceBanner";
import RelayBanner from "@/components/modal/RelayBanner";
import ServiceSuspensionBanner from "@/components/modal/ServiceSuspensionBanner";

export default function BridgeSwap() {
  return (
    <Flex
      flexDir={"column"}
      w={{ base: "100%", lg: "496px" }}
      h={"100%"}
      px={{ base: "12px", lg: 0 }}
      pb={{ base: "16px", lg: 0 }}
    >
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={{ base: "space-between", lg: "center" }}
        w={"100%"}
        h={"100%"}
        mt={{ base: "80px", lg: "0" }}
      >
        {/* <ServiceSuspensionBanner/> */}
        <MaintenanceBanner />

        <Swap />
        <Details />
      </Flex>
    </Flex>
  );
}
