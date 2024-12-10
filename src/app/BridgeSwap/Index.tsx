import { Flex } from "@chakra-ui/layout";
import Swap from "./Swap";
import { Details } from "./Details";
import MaintenanceBanner from "@/components/modal/MaintenanceBanner";
import { SwitchToTestNetwork } from "@/staging/components/cross-trade/components/common/WrongNetwork";
import { BANNER10 } from "@/staging/constants/banner";
import { InitialBanner } from "@/staging/components/legacy-titan/InitialBanner";

export default function BridgeSwap() {
  return (
    <Flex
      flexDir={"column"}
      w={{ base: "100%", lg: "496px" }}
      h={"100%"}
      pt={{ base: "80px", lg: 0 }}
      px={{ base: "12px", lg: 0 }}
      pb={{ base: "16px", lg: 0 }}
    >
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={{ base: "space-between", lg: "center" }}
        w={"100%"}
        h={"100%"}
      >
        {/* <ServiceSuspensionBanner/> */}
        <MaintenanceBanner />
        {BANNER10 && <InitialBanner />}
        {/* <SwitchToTestNetwork
          style={{ marginTop: "55px", marginBottom: "14px" }}
        /> */}
        <Swap />
        <Details />
      </Flex>
    </Flex>
  );
}
