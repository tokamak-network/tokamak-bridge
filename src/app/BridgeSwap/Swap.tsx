"use client";

import { Flex } from "@chakra-ui/layout";
import InToken from "./components/InToken";
import OutToken from "./components/OutToken";

export default function Swap() {
  return (
    <Flex>
      <InToken />
      <OutToken />
    </Flex>
  );
}
