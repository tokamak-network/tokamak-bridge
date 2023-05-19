import { Flex, Text } from "@chakra-ui/layout";
import Image from "next/image";
import ICON_SEARCH from "assets/icons/search.svg";

export default function SearchToken(props: { onClick?: () => any }) {
  return (
    <Flex
      flexDir={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      rowGap={"14px"}
      w={"100%"}
      h={"100%"}
      cursor={"pointer"}
      onClick={props?.onClick}
    >
      <Text fontSize={20} fontWeight={"semibold"}>
        Search Tokens
      </Text>
      <Image src={ICON_SEARCH} alt={"ICON_SEARCH"} />
    </Flex>
  );
}
