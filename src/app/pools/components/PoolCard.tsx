"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import Image from "next/image";
import EthGroup from "../../../assets/tokens/ethGroup.svg";

type poolProps = {
  token1?: string;
  token2?: string;
  slippage?: string;
  range?: string;
  token1Price?: string;
  token2Price?: string;
  gasFee?: string;
  token1Symbol?: string;
  token2Symbol?: string;
};

export default function PoolTile(props: poolProps) {
  return (
    <Flex
      flexDir="column"
      border="3px solid #383736"
      bgColor={!props.gasFee ? "#15161D" : ""}
      w="200px"
      h="248px"
      marginRight={"16px"}
      paddingTop={"12px"}
      paddingBottom={"22px"}
      paddingLeft={"16px"}
      paddingRight={"16px"}
      borderRadius={"16px"}
    >
      <Flex alignItems="center" justifyContent="flex-end">
        <Box w="6px" h="6px" borderRadius="50%" bg="#00EE98" mr="6px" />
        <Text fontSize="11px" fontWeight="600" color="#00EE98">
          {props.range}
        </Text>
      </Flex>
      <Flex alignItems="left" justifyContent="flex-start" flexDir={"column"}>
        <Text fontWeight="semibold" fontSize="18px">
          {props.token1} / {props.token2}
        </Text>
        <Text fontSize={"12px"}>{props.slippage}</Text>
      </Flex>
      <Flex
        position="relative"
        alignItems="center"
        textAlign="center"
        left="20px"
      >
        {props.token1Symbol && (
          <Image
            src={props.token1Symbol}
            alt="iconGroup"
            style={{ position: "absolute", zIndex: 2, left: 0, top: "19px" }}
          />
        )}
        {props.token2Symbol && (
          <Image
            src={props.token2Symbol}
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
          <Text fontWeight="bold">{props.token1}</Text>
          {/* TODO: Convert to $ */}
          <Text marginLeft="2">{props.token1Price} ($1.25)</Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold">{props.token2}</Text>
          <Text marginLeft="2">{props.token2Price} ($1.25)</Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold">FEE</Text>
          <Text marginLeft="2">${props.gasFee}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
