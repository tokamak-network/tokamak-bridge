import React from "react";

import { Flex, Box, Text, Link, Spacer } from "@chakra-ui/react";
import useSwapConfirmModal from "@/components/confirmn/hooks/useSwapConfirmModal";
import Image from "next/image";
import TxLink from "@/assets/icons/newHistory/link.svg";
import TokenPair from "@/components/historyn/components/TokenPair";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { TransactionHistory } from "@/components/historyn/types";
import PendingFooter from "./pendingFooter";
import { FwFormatNumber } from "@/components/fw/components/FwFormatNumber";

interface PendingProps {
  transaction: TransactionHistory;
  transactionHash: string | undefined;
}

export default function Pending(props: PendingProps) {
  const { transaction, transactionHash } = props;
  const { onOpenSwapConfirmModal } = useSwapConfirmModal();
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
        <Flex
          cursor={"pointer"}
          onClick={() => onOpenSwapConfirmModal(transactionData)}
        >
          <Image src={TxLink} alt={"TxLink"} />
        </Flex>
      </Flex>
      <Flex
        h={"36px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        px={"12px"}
        py={"4px"}
        my={"4px"}
        gap={"6px"}
        borderRadius={"6px"}
        border={"1px solid rgba(0, 122, 255, 0.40)"}
      >
        <Flex alignItems='center'>
          <TokenSymbol w={22} h={22} tokenType={transactionData.tokenSymbol} />
          <Box ml={"6px"}>
            <Flex>
              <FwFormatNumber
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "21px",
                  color: "#FFFFFF",
                }}
                value={transactionData.amount}
              />
              <Box w='4px' /> {/** space bar */}
              <Text
                fontWeight={400}
                fontSize={"14px"}
                lineHeight={"21px"}
                color={"#A0A3AD"}
              >
                {transactionData.tokenSymbol}
              </Text>
            </Flex>
          </Box>
        </Flex>
        <TokenPair
          networkI={transactionData.inNetwork}
          networkO={transactionData.outNetwork}
          networkW={22}
          networkH={22}
          pairType={"pending"}
        />
      </Flex>
      <Box>
        <PendingFooter {...transaction} />
      </Box>
    </>
  );
}
