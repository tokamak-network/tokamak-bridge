"use client";
import { Flex, Text, Box } from "@chakra-ui/layout";
import { Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import TokenSymbolPair from "@/components/ui/TokenSymbolPair";
import { PoolCardDetail } from "@/types/pool";
import Link from "next/link";
import Image from "next/image";
import BackIcon from "@/assets/icons/back.svg";
import SettingsIcon from "@/assets/icons/setting.svg";
import RemoveTxnDetail from "./components/RemoveTxnDetail";
import PercentageSlider from "./components/Slider";
import RemoveConfirmModal from "./components/RemoveConfirmModal";

export default function RemoveLiquidity(props: PoolCardDetail) {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // TODO: Get props from data
  const inRange = true;

  const handleSliderValueChange = (value: number) => {
    setSliderValue(value);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <Flex
      flexDir="column"
      w="404px"
      justifyContent="center"
      alignItems="center"
    >
      <Flex
        flexDir="column"
        mb={"10px"}
        w="100%"
        bgColor="#0F0F12"
        zIndex={3}
        top={128}
      >
        <Flex>
          <Link href="/pools">
            <Flex mr="107px">
              <Image src={BackIcon} alt="Back" />
              <Text fontSize="28px" fontWeight="normal" ml={"14px"}>
                Remove Liquidity
              </Text>
            </Flex>
          </Link>
          <Flex alignItems="center">
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
      >
        <Flex w="404px" justifyContent={"center"} p={"20px"} flexDir={"column"}>
          <Flex
            flexDir="column"
            border="3px solid #383736"
            w="364px"
            h="218px"
            paddingTop={"12px"}
            paddingBottom={"22px"}
            paddingLeft={"16px"}
            paddingRight={"16px"}
            borderRadius={"16px"}
          >
            <Flex mb={"12px"}>
              <Flex alignItems={"center"}>
                <Text fontWeight="bold" fontSize="23px">
                  {/* {props.in.symbol} / {props.out.symbol} */}
                  ETH / USDC
                </Text>
                {/* <Text fontSize={"12px"}>{props.slippage}</Text> */}
                <Flex bgColor={"#1F2128"} borderRadius={8} p={1} ml={2}>
                  <Text fontSize={"12px"} as="b">
                    {"0.30%"}
                  </Text>
                </Flex>
              </Flex>
              <Flex alignItems={"center"} justifyContent={"center"}>
                {!inRange ? (
                  <>
                    <Box
                      w="6px"
                      h="6px"
                      borderRadius="50%"
                      bg="#DD3A44"
                      mr="6px"
                      ml="20px"
                    />
                    <Text fontSize="14px" fontWeight="600" color="#DD3A44">
                      Out of Range
                    </Text>
                  </>
                ) : (
                  <>
                    <Box
                      w="6px"
                      h="6px"
                      borderRadius="50%"
                      bg="#00EE98"
                      mr="6px"
                      ml="61px"
                    />
                    <Text fontSize="14px" fontWeight="600" color="#00EE98">
                      In Range
                    </Text>
                  </>
                )}
              </Flex>
            </Flex>

            <Flex
              alignItems="center"
              textAlign="center"
              left="20px"
              justifyContent={"center"}
              mb={"16px"}
            >
              <TokenSymbolPair
                tokenType1={"ETH"}
                tokenType2={"USDC"}
                network="Ethereum"
                w={64}
                h={64}
                w2={20}
                h2={20}
                groupWidth={64}
              />
            </Flex>
            <Flex direction="column" fontSize={"16px"} line-height={"20px"}>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold">ETH</Text>
                <Text marginLeft="2">0.001403</Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold">USDC</Text>
                <Text marginLeft="2">0.001403</Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex w="364px" mt="16px" flexDir={"column"}>
            <Text textAlign="left">Select Amount</Text>
            <PercentageSlider
              sliderValue={sliderValue}
              onSliderValueChange={handleSliderValueChange}
            />
            <RemoveTxnDetail />
          </Flex>

          {sliderValue !== 0 ? (
            <Button
              mt={"12px"}
              h={"48px"}
              bgColor={"#007AFF"}
              border={"none"}
              borderWidth="1px"
              borderRadius="8px"
              _hover={{ bgColor: "#007AFF" }}
              onClick={openModal}
            >
              <Text fontWeight={"bold"} color="#FFFF">
                Preview
              </Text>
            </Button>
          ) : (
            <Button
              mt={"12px"}
              h={"48px"}
              bgColor={"#17181D"}
              border={"none"}
              borderWidth="1px"
              borderRadius="8px"
              _hover={{ bgColor: "#17181D" }}
            >
              <Text fontWeight={"bold"} color="#8E8E92">
                Enter a percent
              </Text>
            </Button>
          )}
        </Flex>
      </Flex>

      <RemoveConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inRange={true}
      />
    </Flex>
  );
}
