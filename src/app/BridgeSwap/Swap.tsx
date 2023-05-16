"use client";

import { Flex } from "@chakra-ui/layout";
import InToken from "./components/InToken";
import OutToken from "./components/OutToken";
import Image from "next/image";
import ArrowImg from "assets/icons/arrow.svg";

export default function Swap() {
  return (
    <Flex columnGap={"24px"}>
      <InToken />
      <Flex justifyContent={"center"} alignItems={"center"} pt={"115px"}>
        <Image src={ArrowImg} alt={"arrow"} />
      </Flex>
      <OutToken />
    </Flex>
  );
}
