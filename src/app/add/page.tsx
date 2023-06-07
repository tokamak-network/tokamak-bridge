"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import Image from "next/image";
import ToggleSwitch from "../pools/components/TokenToggle";
import BackIcon from "@/assets/icons/back.svg";
import SettingsIcon from "@/assets/icons/setting.svg";
import Link from "next/link";
import NetworkDropdown from "@/components/dropdown/Index";
import TierSelector from "./components/TierSelector";
import OutToken from "../BridgeSwap/components/OutToken";
import addIcon from "@/assets/icons/addIcon.svg";
import InputComponent from "./components/NumberInput";
import InTokenSelector from "./components/InTokenSelector";
import OutTokenSelector from "./components/OutTokenSelector";
import PriceInput from "./components/PriceInput";
import zoomInIcon from "@/assets/icons/zoomIn.svg";
import zoomOutIcon from "@/assets/icons/zoomOut.svg";

export default function CreatePoolModal() {
  const [inToken, setInToken] = useState("");
  const [outToken, setOutToken] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

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
        zIndex={3}
        top={128}
        alignItems="center"
        textAlign="center"
      >
        <Text fontSize="28px" fontWeight="normal">
          Add Liquidity
        </Text>
        <Flex justifyContent="space-between">
          <Link href="/pools">
            <Flex
              marginRight={inToken === "" ? "724px" : "670px"}
              cursor={"pointer"}
            >
              <Image src={BackIcon} alt="Back" />
              <Text marginLeft="6px" fontSize="14px">
                Pools
              </Text>
            </Flex>
          </Link>
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
        h="588px"
        borderRadius={"16px"}
        alignItems="center"
        textAlign="center"
        cursor={"pointer"}
      >
        <Flex flexDir="row" w="448px" justifyContent={"center"} pt={"20px"}>
          <Flex flexDir="column" w="408px">
            <Flex flexDir="column" mb={"20px"}>
              <Text textAlign={"left"} mb={"8px"}>
                Select Network
              </Text>
              <Box h="48px">
                <NetworkDropdown inNetwork={false} />
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
                  <InputComponent />
                </Box>
                <Image src={addIcon} alt={"plusIcon"} />
                <Box>
                  <OutTokenSelector />
                  <InputComponent />
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDir="row" w="424px" justifyContent={"center"}>
          <Flex flexDir="column">
            <Flex flexDir="column">
              <Flex flexDir="row" mb={"20px"}>
                <Text>Set Price Range</Text>
                <Flex ml={"194px"}>
                  <Box mr={"8px"}>
                    <Image src={zoomInIcon} alt={"zoomIn"} />
                  </Box>
                  <Box>
                    <Image src={zoomOutIcon} alt={"zoomOut"} />
                  </Box>
                </Flex>
              </Flex>
              <Flex flexDir="column" alignItems={"center"}>
                <Text mb={"16px"}>Current Price: 1541.8 USDC per ETH</Text>
                {/* Graph*/}
                <Box w={"384px"} h={"184px"} border="1px solid #313442"></Box>
              </Flex>
              <Flex h={"17px"}></Flex>
              <Flex justifyContent={"space-between"}>
                <PriceInput
                  titleText={"Min Price"}
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  min={0}
                  max={100}
                  step={1}
                />
                <PriceInput
                  titleText={"Max Price"}
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  min={0}
                  max={100}
                  step={1}
                />
              </Flex>
              <Button
                variant="outline"
                borderWidth="1px"
                borderColor="#313442"
                borderRadius="8px"
                _hover={{ borderColor: "#ffff", bgColor: "#0F0F12" }}
              >
                Full Range
              </Button>
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
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
