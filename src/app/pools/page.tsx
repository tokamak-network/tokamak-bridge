"use client";

import YourPools from "@/pools/YourPools";
import PoolsMessage from "@/pools/PoolsMessage";
import { Flex } from "@chakra-ui/react";

export default function Page() {
  return (
    <Flex pt={"64px"} justifyContent={"center"}>
      <YourPools />
    </Flex>
  );
}
