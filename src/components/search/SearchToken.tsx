import { Flex, Text } from "@chakra-ui/layout";
import Image from "next/image";
import ICON_SEARCH from "assets/icons/search.svg";

export default function SearchToken() {
  return (
    <Flex
      flexDir={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      rowGap={"14px"}
    >
      <Text fontSize={20} fontWeight={"semibold"}>
        Search Tokens
      </Text>
      <Image src={ICON_SEARCH} alt={"ICON_SEARCH"} />
    </Flex>
  );
}
