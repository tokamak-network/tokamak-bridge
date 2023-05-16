import Dropdown from "@/components/dropdown/Index";
import SearchToken from "@/components/search/SearchToken";
import { Box, Flex, Text } from "@chakra-ui/layout";
import Image from "next/image";
import SettingIcon from "assets/icons/setting.svg";

export default function OutToken() {
  return (
    <Flex flexDir={"column"} rowGap={"40px"}>
      <Flex justifyContent={"space-between"}>
        <Text fontSize={36} fontWeight={"semibold"}>
          For
        </Text>
        <Image
          src={SettingIcon}
          alt={"SettingIcon"}
          style={{ cursor: "pointer" }}
        />
      </Flex>
      <Box
        className="card card-empty"
        pt={"15px"}
        display={"flex"}
        flexDir={"column"}
        rowGap={"70px"}
      >
        <Flex justifyContent={"flex-end"} pr={"16px"}>
          <Dropdown />
        </Flex>
        <SearchToken />
      </Box>
    </Flex>
  );
}
