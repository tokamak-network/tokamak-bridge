import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import BACK_ICON from "assets/icons/back.svg";
import SETTING_ICON from "assets/icons/setting.svg";
import ToggleSwitch from "../add/components/TokenToggle";
import Setting from "@/components/Setting";

export default function TopLine(props: {title:string, clear: boolean, switcher: boolean}) {
  const {title, clear, switcher} = props;
  return (
    <Flex alignItems={"center"} justifyContent="space-between">
      <Flex w="100%" alignItems={"center"} columnGap={"12px"}>
        <Link href="/pools">
          <Image src={BACK_ICON} alt="BACK_ICON" />
        </Link>
        <Text fontSize={28} fontWeight={500}>
        {title}
        </Text>
      </Flex>
      <Flex alignItems="center" columnGap={"16px"}>
      {clear &&  <Text
          w={"50px"}
          fontSize={12}
          color="#007AFF"
          onClick={() => {}}
          cursor="pointer"
        >
          Clear all
        </Text>}
      {switcher &&  <ToggleSwitch />}
        <Box w={"20px"} h={"20px"}>
          <Setting />
        </Box>
      </Flex>
    </Flex>
  );
}