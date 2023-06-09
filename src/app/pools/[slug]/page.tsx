"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import { useState } from "react";
import Image from "next/image";
import { PoolCardDetail } from "@/types/pool";
import BackIcon from "@/assets/icons/back.svg";
import Link from "next/link";
import TokenSymbolPair from "@/components/ui/TokenSymbolPair";
import LiquidityInfo from "../components/LiquidityInfo";
import UnclaimedEarnings from "../components/UnclaimedEarnings";
import PriceInput from "../../add/components/PriceInput";

export default function PoolInfo(props: PoolCardDetail) {
  const [liquidity, setLiquidity] = useState(0);
  const [isIncreaseModalOpen, setIsIncreaseModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const handleLiquidity = (value: number) => {
    setLiquidity(value);
  };

  const openIncreaseModal = () => {
    setIsIncreaseModalOpen(true);
  };
  const openRemoveModal = () => {
    setIsRemoveModalOpen(true);
  };

  const handleMinPriceChange = (value: number) => {
    setMinPrice(value);
  };

  const handleMaxPriceChange = (value: number) => {
    setMaxPrice(value);
  };

  return (
    <Flex w={"424px"} flexDir="column">
      <Link href="/pools">
        <Flex mb={"10px"} top={128} w="100%">
          <Image src={BackIcon} alt="Back" />
          <Text fontSize="28px" fontWeight="normal" ml={"14px"}>
            Liquidity Info
          </Text>
        </Flex>
      </Link>
      <Flex
        flexDir="column"
        border="3px solid #383736"
        w="424px"
        h="669px"
        p={"20px"}
        borderRadius={"16px"}
      >
        <Flex>
          <Flex alignItems={"center"}>
            <TokenSymbolPair
              tokenType1={"ETH"}
              tokenType2={"USDC"}
              network="Ethereum"
            />
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
            {props.range === false ? (
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
        <LiquidityInfo
          value={liquidity}
          onClickAdd={openIncreaseModal}
          onClickRemove={openRemoveModal}
          onChange={handleLiquidity}
        />
        <UnclaimedEarnings />
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          textAlign={"center"}
        >
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
      </Flex>
    </Flex>
  );
}
