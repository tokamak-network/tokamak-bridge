"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import Image from "next/image";
import { PoolCardDetail } from "@/types/pool";
import BackIcon from "@/assets/icons/back.svg";
import Link from "next/link";
import TokenSymbolPair from "@/components/ui/TokenSymbolPair";

export default function PoolInfo(props: PoolCardDetail) {
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
        <Flex
          position="relative"
          alignItems="center"
          textAlign="center"
          left="20px"
        >
          {props.in && (
            <Image
              src={props.symbol.inTokenSymbol}
              alt="iconGroup"
              style={{ position: "absolute", zIndex: 2, left: 0, top: "19px" }}
            />
          )}
          {props.out && (
            <Image
              src={props.symbol.outTokenSymbol}
              alt="iconGroup"
              style={{
                position: "absolute",
                zIndex: 1,
                left: "52px",
                top: "19px",
              }}
            />
          )}
        </Flex>
        <Flex
          direction="column"
          fontSize={"12px"}
          marginTop={"95px"}
          line-height={"20px"}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold">{props.in}</Text>
            {/* TODO: Convert to $ */}
            {/* <Text marginLeft="2">{props.trade.inputAmount} ($1.25)</Text> */}
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold">{props.out}</Text>
            {/* <Text marginLeft="2">{props.trade.outTokenAmount} ($1.25)</Text> */}
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold"></Text>
            {/* <Text marginLeft="2">${props.trade.gasFee}</Text> */}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
