"use client";

import Image from "next/image";
import { Flex, Text, Box } from "@chakra-ui/layout";
import { useRecoilValue, useRecoilState } from "recoil";

import { actionMode } from "@/recoil/bridgeSwap/atom";
import { actionMethodStatus } from "@/recoil/modal/atom";
import useMediaView from "@/hooks/mediaView/useMediaView";

import InToken from "./components/InToken";
import OutToken from "./components/OutToken";
import SelectNetwork from "./components/SelectNetwork";
import MobileInToken from "./components/Mobile/MobileInToken";
import MobileOutToken from "./components/Mobile/MobileOutToken";

import ArrowImg from "assets/icons/arrow.svg";
import arrow from "assets/icons/dark_arrowdown.svg";
import SettingIcon from "assets/icons/setting.svg";

export default function Swap() {
  const { mode } = useRecoilValue(actionMode);
  const [, setMethodStatus] = useRecoilState(actionMethodStatus);

  const { pcView, mobileView } = useMediaView();

  return (
    <>
      {pcView ? (
        <Flex w={"100%"} justifyContent={"space-between"} columnGap={"14.6px"}>
          <InToken />
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            pt={mode === null ? "65px" : "80px"}
          >
            <Image src={ArrowImg} alt={"arrow"} />
          </Flex>
          {mode === null ? <SelectNetwork /> : <OutToken />}
        </Flex>
      ) : mobileView ? (
        <Box w={"full"} mt={"16px"}>
          <Flex w={"full"} justify={"space-between"} mb={"12px"}>
            <Flex
              columnGap={"8px"}
              cursor={"pointer"}
              onClick={() => setMethodStatus(true)}
            >
              <Text fontWeight={500} fontSize={24}>
                {mode === null ? "Swap" : mode}
              </Text>
              <Image src={arrow} alt="icon_arrow" />
            </Flex>

            <Image
              src={SettingIcon}
              alt={"SettingIcon"}
              style={{ cursor: "pointer" }}
            />
          </Flex>

          <Flex w={"100%"} justifyContent={"space-between"} columnGap={"8px"}>
            <MobileInToken/>

            <Flex
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Image src={ArrowImg} alt={"arrow"} />
            </Flex>

            <MobileOutToken/>

          </Flex>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}
