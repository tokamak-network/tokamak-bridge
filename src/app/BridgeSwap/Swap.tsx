"use client";

import Image from "next/image";
import { Flex, Text, Box } from "@chakra-ui/layout";
import { useRecoilValue, useRecoilState } from "recoil";

import {
  actionMode,
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { actionMethodStatus, swapSettingStatus } from "@/recoil/modal/atom";
import useMediaView from "@/hooks/mediaView/useMediaView";

import InToken from "./components/InToken";
import OutToken from "./components/OutToken";
import SelectNetwork from "./components/SelectNetwork";
import MobileInToken from "./components/Mobile/MobileInToken";
import MobileOutToken from "./components/Mobile/MobileOutToken";
import ArrowImg from "assets/icons/arrow.svg";
import arrow from "assets/icons/dark_arrowdown.svg";
import SettingIcon from "assets/icons/setting.svg";
import { useCallback } from "react";

export default function Swap() {
  const { mode } = useRecoilValue(actionMode);
  const [, setMethodStatus] = useRecoilState(actionMethodStatus);
  const [, setSettingStatus] = useRecoilState(swapSettingStatus);

  const { pcView, mobileView } = useMediaView();

  const [inTokenRecoilValue, setInTokenRecoilValue] = useRecoilState(
    selectedInTokenStatus
  );
  const [outTokenRecoilValue, setOutTokenRecoilValue] = useRecoilState(
    selectedOutTokenStatus
  );
  const invertTokenPair = useCallback(() => {
    if (inTokenRecoilValue && outTokenRecoilValue) {
      setInTokenRecoilValue(outTokenRecoilValue);
      return setOutTokenRecoilValue(inTokenRecoilValue);
    }
  }, [inTokenRecoilValue, outTokenRecoilValue]);
  
  return (
    <>
      {pcView ? (
        <Flex w={"100%"} justifyContent={"space-between"} columnGap={"14.6px"}>
          <InToken />
          <Flex
            onClick={invertTokenPair}
            cursor={
              mode === "Swap" || mode === "Unwrap" || mode === "Wrap"
                ? "pointer"
                : ""
            }
            justifyContent={"center"}
            alignItems={"center"}
            pt={mode === null ? "65px" : "80px"}>
            <Image src={ArrowImg} alt={"arrow"} width={24} />
          </Flex>
          {mode === null ? <SelectNetwork /> : <OutToken />}
        </Flex>
      ) : (
        <Box w={"full"} mt={"16px"}>
          <Flex w={"full"} justify={"space-between"} mb={"12px"}>
            <Flex
              columnGap={"8px"}
              cursor={"pointer"}
              onClick={() => setMethodStatus(true)}>
              <Text fontWeight={500} fontSize={24}>
                {mode === null ? "Swap" : mode.replaceAll("ETH-", "")}
              </Text>
              <Image src={arrow} alt="icon_arrow" />
            </Flex>

            {mode === "Swap" && (
              <Image
                onClick={() => setSettingStatus(true)}
                src={SettingIcon}
                alt={"SettingIcon"}
                style={{ cursor: "pointer" }}
              />
            )}
          </Flex>

          <Flex w={"100%"} mx={"auto"} columnGap={"8px"} justify={"center"}>
            <MobileInToken />

            <Flex justifyContent={"center"} alignItems={"center"}  onClick={invertTokenPair}>
              <Image src={ArrowImg} alt={"arrow"} />
            </Flex>

            <MobileOutToken />
          </Flex>
        </Box>
      )}
    </>
  );
}
