"use client";

import YourPools from "@/pools/YourPools";
import { Flex } from "@chakra-ui/react";

export default function Page() {
  return (
    <Flex pt={"134px"} justifyContent={"center"} h={"100%"}>
      <YourPools />
    </Flex>
  );
}
