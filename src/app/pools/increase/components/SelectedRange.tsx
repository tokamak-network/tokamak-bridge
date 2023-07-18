import { Flex, Text, Box } from "@chakra-ui/layout";
import Title from "../../add/components/Title";
import useGetIncreaseLiquidity from "@/hooks/pool/useIncreaseLiquidity";
import RangeCard from "./RangeCard";
import Image from "next/image";
import exchange from "assets/icons/exchange.svg";
import { useState } from "react";

export default function SelectedRange(props: { show: boolean }) {
  const { liquidityInfo } = useGetIncreaseLiquidity();
  const { show } = props;
  return (
    <Flex
      w={"100%"}
      flexDir={"column"}
      justifyContent={"center"}
      textAlign={"center"}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Title title={"Selected range"} style={{ marginBottom: 0 }} />
        {show && (
          <Flex minW={"250px"} justifyContent={"end"}>
            <Text
              color={liquidityInfo.inRange ? "#00EE98" : "#DD3A44"}
              fontSize={"11px"}
            >
              Your position is {liquidityInfo.inRange === false && "not"}{" "}
              currently earning fees.
            </Text>
          </Flex>
        )}
      </Flex>
      <Flex flexDir="column" alignItems={"center"} mt="8px">
        <Flex justifyContent={"space-between"} alignItems={"center"} w="100%">
          <RangeCard
            title="Min Price"
            border={true}
            tooltip="Your position will be 100% ETH at this price."
            price="772.84"
            token0="ETH"
            token1="USDC"
          />
          <Flex
            h="32px"
            w="32px"
            borderRadius={"8px"}
            border={"1px solid #313442"}
            justifyContent={"center"}
            alignItems={"center"}
            ml={"-10px"}
            bg={!show ? "#1F2128" : "#0F0F12"}
            zIndex={10}
            mr={"-10px"}
          >
            <Image src={exchange} alt="exchange_icon" />
          </Flex>
          <RangeCard
            title="Max Price"
            border={true}
            tooltip="Your position will be 100% ETH at this price."
            price="772.84"
            token0="ETH"
            token1="USDC"
          />
        </Flex>
        <RangeCard
          title="Current Price"
          border={false}
          tooltip=""
          price="772.84"
          token0="ETH"
          token1="USDC"
        />
      </Flex>
    </Flex>
  );
}
