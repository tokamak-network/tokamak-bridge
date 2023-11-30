"use client";

import { Flex } from "@chakra-ui/layout";
import InToken from "./components/InToken";
import OutToken from "./components/OutToken";
import Image from "next/image";
import ArrowImg from "assets/icons/arrow.svg";
import SelectNetwork from "./components/SelectNetwork";
import { actionMode, selectedInTokenStatus, selectedOutTokenStatus } from "@/recoil/bridgeSwap/atom";
import { useRecoilState, useRecoilValue } from "recoil";

export default function Swap() {
  const { mode } = useRecoilValue(actionMode);
  const [inTokenRecoilValue, setInTokenRecoilValue] = useRecoilState(
    selectedInTokenStatus
  );
  const [outTokenRecoilValue, setOutTokenRecoilValue] = useRecoilState(
    selectedOutTokenStatus
  );

  console.log(inTokenRecoilValue,outTokenRecoilValue);
  
  return (
    <Flex w={"100%"} justifyContent={"space-between"} columnGap={"14.6px"}>
      <InToken />
      <Flex
      // onClick={}
        justifyContent={"center"}
        alignItems={"center"}
        pt={mode === null ? "65px" : "80px"}
      >
        <Image src={ArrowImg} alt={"arrow"} />
      </Flex>
      {mode === null ? <SelectNetwork /> : <OutToken />}
    </Flex>
  );
}
