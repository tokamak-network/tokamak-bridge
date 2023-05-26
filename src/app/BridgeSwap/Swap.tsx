"use client";

import { Flex } from "@chakra-ui/layout";
import InToken from "./components/InToken";
import OutToken from "./components/OutToken";
import Image from "next/image";
import ArrowImg from "assets/icons/arrow.svg";
import SelectNetwork from "./components/SelectNetwork";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { useRecoilValue } from "recoil";

export default function Swap() {
  const { mode } = useRecoilValue(actionMode);

  return (
    <Flex w={"100%"} justifyContent={"space-between"} columnGap={"14.6px"}>
      <InToken />
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        pt={mode === null ? 0 : "115px"}
      >
        <Image src={ArrowImg} alt={"arrow"} />
      </Flex>
      {mode === null ? <SelectNetwork /> : <OutToken />}
    </Flex>
  );
}
