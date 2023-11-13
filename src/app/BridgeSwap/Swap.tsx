"use client";

import { Flex, Text } from "@chakra-ui/layout";
import InToken from "./components/InToken";
import OutToken from "./components/OutToken";
import Image from "next/image";
import ArrowImg from "assets/icons/arrow.svg";
import SelectNetwork from "./components/SelectNetwork";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { actionMethod } from "@/recoil/bridgeSwap/atom";
import { actionMethodStatus } from "@/recoil/modal/atom";

import { useRecoilValue, useRecoilState } from "recoil";
import useMediaView from "@/hooks/mediaView/useMediaView";

import arrow from "assets/icons/dark_arrowdown.svg";
import SettingIcon from "assets/icons/setting.svg";
import { ActionMethod } from "@/types/bridgeSwap";

export default function Swap() {
  const { mode } = useRecoilValue(actionMode);
  const method = useRecoilValue(actionMethod);
  const [, setMethodStatus] = useRecoilState(actionMethodStatus);

  const { pcView, mobileView } = useMediaView();

  return (
    <Flex w={"100%"} justifyContent={"space-between"} columnGap={"14.6px"}>
      {pcView ? (
        <>
          <InToken />
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            pt={mode === null ? "65px" : "80px"}
          >
            <Image src={ArrowImg} alt={"arrow"} />
          </Flex>
          {mode === null ? <SelectNetwork /> : <OutToken />}
        </>
      ) : mobileView ? (
        <>
          <Flex w={"full"} justify={"space-between"}>
            <Flex
              columnGap={"8px"}
              cursor={"pointer"}
              onClick={() => setMethodStatus(true)}
            >
              <Text fontWeight={500} fontSize={24}>
                {method}
              </Text>
              <Image src={arrow} alt="icon_arrow" />
            </Flex>

            <Image
              src={SettingIcon}
              alt={"SettingIcon"}
              style={{ cursor: "pointer" }}
            />
          </Flex>
        </>
      ) : (
        <></>
      )}
    </Flex>
  );
}
