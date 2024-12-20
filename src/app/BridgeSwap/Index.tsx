import { Flex } from "@chakra-ui/layout";
import Swap from "./Swap";
import { Details } from "./Details";
import MaintenanceBanner from "@/components/modal/MaintenanceBanner";
import { Banner10Component } from "@/staging/components/legacy-titan/Banner10";
import {
  BRIDGE_VERSION,
  LegacyTitanMaintenanceStatus,
} from "@/staging/constants/legacyTitan";
import {
  LegacyTitanBridgeVersionEnum,
  LegacyTitanMaintenanceEnum,
} from "@/staging/types/legacyTitan";
import { Banner11Component } from "@/staging/components/legacy-titan/Banner11";
import { Banner110Component } from "@/staging/components/legacy-titan/Banner110";
import { TitanSunsetWarningModal10 } from "@/staging/components/legacy-titan/WarningModal10";

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

        {BRIDGE_VERSION === LegacyTitanBridgeVersionEnum.V01 && (
          <Banner10Component />
        )}
        {BRIDGE_VERSION === LegacyTitanBridgeVersionEnum.V10 &&
          LegacyTitanMaintenanceStatus ===
            LegacyTitanMaintenanceEnum.IN_PROGRESS && <Banner110Component />}
        {BRIDGE_VERSION === LegacyTitanBridgeVersionEnum.V10 &&
          LegacyTitanMaintenanceStatus === LegacyTitanMaintenanceEnum.DONE && (
            <Banner11Component />
          )}
        {/* <SwitchToTestNetwork
          style={{ marginTop: "55px", marginBottom: "14px" }}
        /> */}
        <Swap />
        <Details />
        {BRIDGE_VERSION === LegacyTitanBridgeVersionEnum.V10 && (
          <TitanSunsetWarningModal10 />
        )}
      </Flex>
    </Flex>
  );
}
