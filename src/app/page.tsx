"use client";

import { Flex } from "@chakra-ui/react";
import BridgeSwap from "./BridgeSwap/Index";

export default function Page() {
  return (
    <Flex alignItems={"center"} h={"100%"}>
      <BridgeSwap />
    </Flex>
  );
}
