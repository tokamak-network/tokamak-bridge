import React from "react";

import { Flex, Box, Text, Link, Spacer } from "@chakra-ui/react";
import useDepositWithdrawConfirmModal from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModal";
import Image from "next/image";
import TxLink from "@/assets/icons/newHistory/link.svg";
import TokenPair from "@/staging/components/new-history/components/TokenPair";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { TransactionHistory } from "@/staging/types/transaction";
import PendingFooter from "./PendingFooter";
import { convertNumber } from "@/utils/trim/convertNumber";
import { FormatNumber } from "@/staging/components/common/FormatNumber";

interface PendingProps {
  transaction: TransactionHistory;
  transactionHash: string | undefined;
}

// 코멘트
export default function Pending(props: PendingProps) {
  const { transaction, transactionHash } = props;
  const { onOpenDepositWithdrawConfirmModal } =
    useDepositWithdrawConfirmModal();
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
          onClick={() => onOpenDepositWithdrawConfirmModal(transactionData)}
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
          <TokenSymbol
            w={22}
            h={22}
            tokenType={transactionData.inToken.symbol}
          />
          <Box ml={"6px"}>
            <Flex>
              <FormatNumber
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "21px",
                  color: "#FFFFFF",
                }}
                value={convertNumber(
                  transactionData.inToken.amount,
                  transactionData.inToken.decimals
                )}
              />
              <Box w='4px' /> {/** space bar */}
              <Text
                fontWeight={400}
                fontSize={"14px"}
                lineHeight={"21px"}
                color={"#A0A3AD"}
              >
                {transactionData.inToken.symbol}
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
