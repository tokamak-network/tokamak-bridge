"use client";

import { Flex } from "@chakra-ui/layout";
import InToken from "./components/InToken";
import OutToken from "./components/OutToken";
import TokenCard from "@/components/card/TokenCard";

export default function Swap() {
  return (
    <Flex>
      <InToken />
      <TokenCard></TokenCard>
      <OutToken />
    </Flex>
  );
}
