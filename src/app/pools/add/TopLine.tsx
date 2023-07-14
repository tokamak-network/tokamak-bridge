import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import BACK_ICON from "assets/icons/back.svg";
import SETTING_ICON from "assets/icons/setting.svg";
import ToggleSwitch from "./components/TokenToggle";
import Setting from "@/components/Setting";

export default function TopLine() {
  return (
    <Flex alignItems={"center"} justifyContent="space-between">
      <Flex w="100%" alignItems={"center"} columnGap={"12px"}>
        <Link href="/pools">
          <Image src={BACK_ICON} alt="BACK_ICON" />
        </Link>
        <Text fontSize={28} fontWeight={500}>
          Add Liquidity
        </Text>
      </Flex>
      <Flex alignItems="center" columnGap={"16px"}>
        <Text
          w={"50px"}
          fontSize={12}
          color="#007AFF"
          onClick={() => {}}
          cursor="pointer"
        >
          Clear all
        </Text>
        <ToggleSwitch />
        <Box w={"20px"} h={"20px"}>
          <Setting />
        </Box>
      </Flex>
    </Flex>
  );
}
