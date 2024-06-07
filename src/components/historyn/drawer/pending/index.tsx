import React from "react";

import { Flex, Box, Text, Circle } from "@chakra-ui/react";
import Image from "next/image";
import TxLink from "@/assets/icons/newHistory/link.svg";
import TokenPair from "@/components/historyn/components/TokenPair";
import { TokenSymbol } from "@/componenets/image/TokenSymbol";
import { TransactionHistory } from "@/componenets/historyn/types";
import PendingFooter from "./pendingFooter";

export default function Pending(transaction: TransactionHistory) {
  const transactionData = transaction;

  return (
    <>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text
          fontWeight={600}
          fontSize={"14px"}
          lineHeight={"22px"}
          color={"#FFFFFF"}
        >
          {transactionData.action}
        </Text>
        <Flex>
          <Image src={TxLink} alt={"TxLink"} />
        </Flex>
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
        <Flex alignItems='center'>
          <TokenSymbol w={22} h={22} tokenType={transactionData.tokenSymbol} />
          <Box ml={"6px"}>
            <Text
              fontWeight={400}
              fontSize={"9px"}
              lineHeight={"13.5px"}
              color={"#A0A3AD"}
            >
              {transactionData.tokenSymbol}
            </Text>
            <Text fontWeight={400} fontSize={"12px"} lineHeight={"18px"}>
              {transactionData.amount}
            </Text>
          </Box>
        </Flex>
        <TokenPair
          networkI={transactionData.inNetwork}
          networkO={transactionData.outNetwork}
          networkW={22}
          networkH={22}
        />
      </Flex>
      <Box>
        <PendingFooter {...transaction} />
      </Box>
    </>
  );
}
