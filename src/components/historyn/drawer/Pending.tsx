import React, { useEffect, useState } from "react";

import axios from "axios";
import { Flex, Box, Text, Circle } from "@chakra-ui/react";
import EthTokenSymbol from "@/assets/icons/newHistory/eth-t-symbol.svg";
import Image from "next/image";
import TxLink from "@/assets/icons/newHistory/link.svg";
import TokenPair from "@/componenets/historyn/drawer/TokenPair";

import { Network } from "@/componenets/historyn/types";

export default function Pending() {
  return (
    <>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text
          fontWeight={600}
          fontSize={"14px"}
          lineHeight={"22px"}
          color={"#FFFFFF"}
        >
          Withdraw
        </Text>
        <Image src={TxLink} alt={"TxLink"} />
      </Flex>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        px={"12px"}
        py={"4px"}
        my={"4px"}
        borderRadius={"6px"}
        border={"1px solid rgba(0, 122, 255, 0.40)"}
      >
        <Flex>
          <Image src={EthTokenSymbol} alt={"EthTokenSymbol"} />
          <Box ml={"6px"}>
            <Text
              fontWeight={400}
              fontSize={"9px"}
              lineHeight={"13.5px"}
              color={"#A0A3AD"}
            >
              eth
            </Text>
            <Text fontWeight={400} fontSize={"12px"} lineHeight={"18px"}>
              0.01234
            </Text>
          </Box>
        </Flex>
        <TokenPair
          networkI={Network.Mainnet}
          networkO={Network.Titan}
          networkW={22}
          networkH={22}
        />
      </Flex>
      <Box>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Flex alignItems='center'>
            <Circle size='6px' bg={"#007AFF"} />
            <Text
              ml={"6px"}
              fontSize={"11px"}
              fontWeight={600}
              lineHeight={"22px"}
              color={"#A0A3AD"}
            >
              Initiate
            </Text>
          </Flex>
          <Text
            fontSize={"11px"}
            fontWeight={400}
            lineHeight={"22px"}
            color={"#A0A3AD"}
          >
            2023.04.03
          </Text>
        </Flex>
        {/* 반복되는 내용 */}
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Flex alignItems='center'>
            <Circle size='6px' bg={"#007AFF"} />
            <Text
              ml={"6px"}
              fontSize={"11px"}
              fontWeight={600}
              lineHeight={"22px"}
              color={"#A0A3AD"}
            >
              Finalize
            </Text>
          </Flex>
          <Text
            fontSize={"11px"}
            fontWeight={400}
            lineHeight={"22px"}
            color={"#A0A3AD"}
          >
            00 : 00
          </Text>
        </Flex>
      </Box>
    </>
  );
}
