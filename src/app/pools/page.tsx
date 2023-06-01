"use client";

import { Flex, Text } from "@chakra-ui/layout";

export default function Pools() {
  return (
    <Flex flexDir={"column"}>
      <Text fontSize={"36px"} fontWeight={"500"} marginBottom={"24px"}>
        Your Pools
      </Text>
      <Flex
        flexDir="column"
        w="673px"
        h="700px"
        alignItems="flex-start"
        padding="16px"
        border="1px solid #313442"
        borderRadius="13px"
      >
        Cards
      </Flex>
    </Flex>
  );
}
