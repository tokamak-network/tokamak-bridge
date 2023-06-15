"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import Image from "next/image";
import { PoolCardDetail } from "@/types/pool";

export default function PoolTile(props: PoolCardDetail) {
  return (
    <Flex
      flexDir="column"
      border="3px solid #383736"
      bgColor={!props.id ? "#15161D" : ""}
      w="200px"
      h="248px"
      paddingTop={"12px"}
      paddingBottom={"22px"}
      paddingLeft={"16px"}
      paddingRight={"16px"}
      borderRadius={"16px"}
      _hover={{
        border: "1px solid #007AFF",
      }}
    >
      <Flex alignItems="center" justifyContent="flex-end">
        {props.range === false ? (
          <>
            <Box w="6px" h="6px" borderRadius="50%" bg="#DD3A44" mr="6px" />
            <Text fontSize="11px" fontWeight="600" color="#DD3A44">
              Out of Range
            </Text>
          </>
        ) : (
          <>
            <Box w="6px" h="6px" borderRadius="50%" bg="#00EE98" mr="6px" />
            <Text fontSize="11px" fontWeight="600" color="#00EE98">
              In Range
            </Text>
          </>
        )}
      </Flex>

      <Flex alignItems="left" justifyContent="flex-start" flexDir={"column"}>
        <Text fontWeight="semibold" fontSize="18px">
          {/* {props.in.symbol} / {props.out.symbol} */}
          {props.in} / {props.out}
        </Text>
        <Text fontSize={"12px"}>{props.slippage}</Text>
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
          <Text marginLeft="2">{props.trade.inputAmount} ($1.25)</Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold">{props.out}</Text>
          <Text marginLeft="2">{props.trade.outTokenAmount} ($1.25)</Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold">Earnings</Text>
          <Text marginLeft="2">${props.trade.gasFee}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
