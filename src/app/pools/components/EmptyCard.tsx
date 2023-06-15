"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";

export default function EmptyCard() {
  return (
    <Flex
      flexDir="column"
      border="3px solid #383736"
      bgColor="#15161D"
      w="200px"
      h="248px"
      marginRight={"16px"}
      paddingTop={"12px"}
      paddingBottom={"22px"}
      paddingLeft={"16px"}
      paddingRight={"16px"}
      borderRadius={"16px"}
    ></Flex>
  );
}
