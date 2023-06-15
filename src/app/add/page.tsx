"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { atom } from "recoil";
import { useState, useMemo, useCallback } from "react";
import { useRecoilCallback, useRecoilState } from "recoil";
import Image from "next/image";
import ToggleSwitch from "../pools/components/TokenToggle";
import BackIcon from "@/assets/icons/back.svg";
import SettingsIcon from "@/assets/icons/setting.svg";
import Link from "next/link";
import NetworkDropdown from "@/components/dropdown/Index";
import addIcon from "@/assets/icons/addIcon.svg";
import InTokenSelector from "./components/inTokenSelector";
import OutTokenSelector from "./components/OutTokenSelector";
import PriceInput from "./components/priceInput";
import TokenInput from "@/components/input/TokenInput";
import InitializeInfo from "./components/InitializeInfo";
import Modals from "./Modal";
import InvalidRangeWarning from "./components/WarningText";
import PositionInfo from "./components/PositionInfo";
import InputAmount from "./components/InputAmount";
import TierSelector from "./components/tierSelector";

export default function CreatePoolModal() {
  const [inToken, setInToken] = useState("");
  const [outToken, setOutToken] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const hasPool = true;

  const NetworkSwitcher = useMemo(() => {
    return <NetworkDropdown inNetwork={true} />;
  }, []);

  const handleMinPriceChange = (value: number) => {
    setMinPrice(value);
  };

  const handleMaxPriceChange = (value: number) => {
    setMaxPrice(value);
  };

  const handleClearAll = () => {
    setInToken("");
    setOutToken("");
  };

  return (
    <Flex flexDir={"column"} w={"872px"}>
      <Flex
        flexDir="column"
        mb={"10px"}
        w="100%"
        bgColor="#0F0F12"
        alignItems="center"
      >
        <Flex justifyContent="space-between">
          <Flex
            marginRight={inToken === "" ? "567px" : "455px"}
            cursor={"pointer"}
          >
            <Link href="/pools">
              <Flex mb={"10px"} top={128} w="100%">
                <Image src={BackIcon} alt="Back" />
                <Text fontSize="28px" fontWeight="normal" ml={"14px"}>
                  Add Liquidity
                </Text>
              </Flex>
            </Link>
          </Flex>
          <Flex alignItems="center">
            {inToken && outToken && (
              <ToggleSwitch inToken={inToken} outToken={outToken} />
            )}
            <Text
              fontSize="12px"
              color="#007AFF"
              marginRight="6px"
              onClick={handleClearAll}
              cursor="pointer"
            >
              Clear All
            </Text>
            <Image width={18} height={18} src={SettingsIcon} alt="Settings" />
          </Flex>
        </Flex>
      </Flex>
      <Flex
        border="1px solid #20212B"
        borderRadius={"16px"}
        alignItems="center"
        textAlign="center"
        cursor={"pointer"}
        pb="20px"
      >
        <Flex
          flexDir="row"
          w="448px"
          justifyContent={"center"}
          mt="20px"
          flex={1}
        >
          <Flex flexDir="column" w="408px">
            <Flex flexDir="column" mb={"20px"}>
              <Text textAlign={"left"} mb={"8px"}>
                Select Network
              </Text>
              <Box>
                <NetworkDropdown
                  inNetwork={false}
                  // TODO: Reverted when merging. WIP
                  // width="408px"
                  // height="48px"
                  // innerWidth="408px"
                />
              </Box>
            </Flex>
            <Flex flexDir="column" mb={"20px"}>
              <Text textAlign={"left"} mb={"8px"}>
                Select Free Tier
              </Text>
              <TierSelector />
            </Flex>
            <Flex flexDir="column" mb={"20px"}>
              <Text textAlign={"left"}>Select Pair</Text>
              <Flex flexDir={"row"}>
                <Box mr={"9px"}>
                  <InTokenSelector />
                  {inToken && (
                    <TokenInput
                      inToken={true}
                      style={{ width: "178px", marginLeft: "9px" }}
                      inputKey="in"
                    />
                  )}
                </Box>
                <Image src={addIcon} alt={"plusIcon"} />
                <Box>
                  <OutTokenSelector />
                  {outToken && (
                    <TokenInput
                      inToken={false}
                      style={{ width: "178px", marginLeft: "20px" }}
                      inputKey="out"
                    />
                  )}
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        {/* Graph & Min Max Price component */}
        <Flex flexDir="row" w="424px" justifyContent={"center"}>
          <Flex flexDir="column">
            <Flex flexDir="column">
              {/* <PositionInfo /> */}
              <InitializeInfo />
              <InputAmount inToken="ETH" outToken="USDC" />
              <Flex justifyContent={"space-between"}>
                <PriceInput
                  titleText={"Min Price"}
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  min={0}
                  max={100}
                  step={1}
                  inToken="ETH"
                  outToken="USDC"
                  border={true}
                  bgColor="#1F2128"
                  isInputChange={true}
                />
                <PriceInput
                  titleText={"Max Price"}
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  min={0}
                  max={100}
                  step={1}
                  inToken="ETH"
                  outToken="USDC"
                  border={true}
                  bgColor="#1F2128"
                  isInputChange={true}
                />
              </Flex>
              {/* <Button
                variant="outline"
                borderWidth="1px"
                borderColor="#313442"
                borderRadius="8px"
                _hover={{ borderColor: "#ffff", bgColor: "#0F0F12" }}
              >
                Full Range
              </Button> */}
              {/* <InvalidRange /> */}
              {/* {inToken && outToken && hasPool ? (
                <Button
                  mt={"36px"}
                  h={"48px"}
                  bgColor={"#007AFF"}
                  border={"none"}
                  borderWidth="1px"
                  borderRadius="8px"
                  _hover={{ bgColor: "#007AFF" }}
                >
                  <Text fontWeight={"bold"}>Preview</Text>
                </Button>
              ) : (
                <Button
                  mt={"36px"}
                  h={"48px"}
                  bgColor={"#17181D"}
                  border={"none"}
                  borderWidth="1px"
                  borderRadius="8px"
                  _hover={{ bgColor: "#17181D" }}
                >
                  <Text fontWeight={"bold"}>Invalid Pair</Text>
                </Button>
              )} */}
              {hasPool ? (
                <>
                  <Button
                    mt={"68px"}
                    h={"48px"}
                    bgColor={"#007AFF"}
                    border={"none"}
                    borderWidth="1px"
                    borderRadius="8px"
                    _hover={{ bgColor: "#007AFF" }}
                  >
                    <Text fontWeight={"bold"}>Approve WTON</Text>
                  </Button>
                  <Button
                    mt={"12px"}
                    h={"48px"}
                    bgColor={"#17181D"}
                    border={"none"}
                    borderWidth="1px"
                    borderRadius="8px"
                    _hover={{ bgColor: "#17181D" }}
                  >
                    <Text fontWeight={"bold"}>Preview</Text>
                  </Button>
                </>
              ) : (
                <Button
                  mt={"36px"}
                  h={"48px"}
                  bgColor={"#007AFF"}
                  border={"none"}
                  borderWidth="1px"
                  borderRadius="8px"
                  _hover={{ bgColor: "#007AFF" }}
                >
                  <Text fontWeight={"bold"}>Approve WTON</Text>
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Modals />
    </Flex>
  );
}
