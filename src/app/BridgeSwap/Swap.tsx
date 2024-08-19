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
import MobileTokenBox from "@/components/mobile/input/MobileTokenBox";
import ArrowImg from "assets/icons/arrow.svg";
import arrow from "assets/icons/dark_arrowdown.svg";
import SettingIcon from "assets/icons/setting.svg";
import { useCallback } from "react";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useConnectedNetwork from "@/hooks/network";
import useTokenModal from "@/hooks/modal/useTokenModal";

export default function Swap() {
  const { inToken, outToken } = useInOutTokens();
  const { mode } = useRecoilValue(actionMode);
  const [, setMethodStatus] = useRecoilState(actionMethodStatus);
  const [, setSettingStatus] = useRecoilState(swapSettingStatus);
  const { pcView, mobileView } = useMediaView();
  const { isInTokenOpen, isOutTokenOpen } = useTokenModal();

  const [inTokenRecoilValue, setInTokenRecoilValue] = useRecoilState(
    selectedInTokenStatus
  );
  const [outTokenRecoilValue, setOutTokenRecoilValue] = useRecoilState(
    selectedOutTokenStatus
  );

  const network = useConnectedNetwork();

  const invertTokenPair = useCallback(() => {
    if (mode == "Deposit" || mode == "Withdraw" || !mode) return;

    if (inTokenRecoilValue && outTokenRecoilValue) {
      const tempValue = inTokenRecoilValue;

      if (
        mode === "Wrap" ||
        mode === "Unwrap" ||
        mode === "ETH-Unwrap" ||
        mode === "ETH-Wrap"
      ) {
        setInTokenRecoilValue({
          ...outTokenRecoilValue,
          amountBN: tempValue.amountBN,
          parsedAmount: tempValue.parsedAmount,
        });
      } else {
        setInTokenRecoilValue(outTokenRecoilValue);
      }

      setOutTokenRecoilValue(tempValue);
    } else if (inTokenRecoilValue && !outTokenRecoilValue) {
      setOutTokenRecoilValue(inTokenRecoilValue);
      setInTokenRecoilValue(null);
    } else if (!inTokenRecoilValue && outTokenRecoilValue) {
      setInTokenRecoilValue(outTokenRecoilValue);
      setOutTokenRecoilValue(null);
    }
  }, [inTokenRecoilValue, outTokenRecoilValue, mode]);

  const switchable =
    mode === "Swap" ||
    mode === "Wrap" ||
    mode === "Unwrap" ||
    mode === "ETH-Unwrap" ||
    mode === "ETH-Wrap";

  return (
    <>
      {pcView ? (
        <Flex
          w={"100%"}
          justifyContent={"space-between"}
          columnGap={switchable ? "6px" : "5px"}
        >
          <InToken />
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            pt={mode === null ? "65px" : "80px"}
            opacity={isInTokenOpen || isOutTokenOpen ? 0.05 : 1}
          >
            <Flex
              onClick={invertTokenPair}
              cursor={
                mode === "Swap" ||
                mode === "Unwrap" ||
                mode === "Wrap" ||
                mode === "ETH-Unwrap" ||
                mode === "ETH-Wrap"
                  ? "pointer"
                  : ""
              }
              bg={switchable ? "#1F2128" : "transparent"}
              w={"36px"}
              h={"36px"}
              justifyContent={"center"}
              alignItems={"center"}
              borderRadius={"5px"}
              _hover={{ border: switchable ? "2px solid #313442" : "" }}
            >
              <Image src={ArrowImg} alt={"arrow"} width={24} />
            </Flex>
          </Flex>
          {mode === null ? <SelectNetwork /> : <OutToken />}
        </Flex>
      ) : (
        <Box w={"full"} mt={"16px"}>
          <Flex w={"full"} justify={"space-between"} mb={"12px"}>
            <Flex
              columnGap={"8px"}
              cursor={"pointer"}
              onClick={() => setMethodStatus(true)}
            >
              <Text fontWeight={500} fontSize={24} userSelect={"none"}>
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

          <Flex
            w={"100%"}
            mx={"auto"}
            columnGap={"8px"}
            justify={"center"}
            align={"center"}
          >
            <MobileInToken />

            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              onClick={invertTokenPair}
              rounded={"5px"}
              w={"24px"}
              h={"24px"}
              p={"4px"}
              bg={switchable ? "#1F2128" : "transparent"}
            >
              <Image src={ArrowImg} alt={"arrow"} />
            </Flex>

            <MobileOutToken />
          </Flex>

          <Flex direction="row" justify="center" w="full">
            {network.isSupportedChain && (
              <>
                <MobileTokenBox inToken={true} visibilityType={false} />
                <MobileTokenBox inToken={false} visibilityType={false} />
              </>
            )}
          </Flex>
        </Box>
      )}
    </>
  );
}
