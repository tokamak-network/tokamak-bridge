import React, { useCallback, useEffect, useMemo } from "react";

import { Flex, Box, Text, Link, Spacer } from "@chakra-ui/react";
import useDepositWithdrawConfirmModal from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModal";
import Image from "next/image";
import TxLink from "@/assets/icons/newHistory/link.svg";
import TokenPair from "@/staging/components/new-history-thanos/components/TokenPair";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import {
  Action,
  CT_ACTION,
  CT_History,
  HISTORY_SORT,
  isDepositTransactionHistory,
  isWithdrawTransactionHistory,
  Status,
  TransactionHistory,
} from "@/staging/types/transaction";
import PendingFooter from "./PendingFooter";
import { convertNumber } from "@/utils/trim/convertNumber";
import { FormatNumber } from "@/staging/components/common/FormatNumber";
import useCTConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import { ModalType } from "@/staging/components/cross-trade/types";
import { useHistoryTab } from "@/staging/hooks/useHistoryTab";
import ArrowIcon from "@/assets/icons/newHistory/small-arrow-gray.svg";
import { useAccount } from "wagmi";
import { trimAddress } from "@/utils/trim";

interface PendingProps {
  transaction: TransactionHistory;
}

export default function Pending(props: PendingProps) {
  const { transaction } = props;
  const { address } = useAccount();
  const { onOpenDepositWithdrawConfirmModal } =
    useDepositWithdrawConfirmModal();

  const transactionData = transaction;
  const isExternalBridge =
    (transactionData.action === Action.Deposit ||
      transactionData.action === Action.Withdraw) &&
    transactionData?.fromAddress !== transactionData?.toAddress;
  const title = useMemo(() => {
    switch (transactionData.action) {
      case Action.Withdraw:
        return "Withdraw";
      case Action.Deposit:
        return "Deposit";
      case CT_ACTION.REQUEST:
        return "Request";
      case CT_ACTION.PROVIDE:
        return "Provide";
      default:
        return "-";
    }
  }, [transactionData.action]);

  const openModal = useCallback(() => {
    if (
      transactionData.category === HISTORY_SORT.STANDARD &&
      (isDepositTransactionHistory(transactionData) ||
        isWithdrawTransactionHistory(transactionData))
    ) {
      onOpenDepositWithdrawConfirmModal(transactionData);
    }
  }, [transactionData]);

  const { isOnOfficialStandard } = useHistoryTab();

  return (
    <>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text
          fontWeight={600}
          fontSize={"14px"}
          lineHeight={"22px"}
          color={"#FFFFFF"}
        >
          {title}
        </Text>
        <Flex gap={"8px"}>
          {isExternalBridge && (
            <Flex gap={"3px"}>
              <Text
                color={"#A0A3AD"}
                fontSize={"11px"}
                fontWeight={400}
                lineHeight={"22px"}
              >
                {transactionData?.fromAddress === address
                  ? "This address"
                  : trimAddress({
                      address: transactionData?.fromAddress,
                      firstChar: 6,
                    })}
              </Text>
              <Image src={ArrowIcon} alt={"arrow icon"} />
              <Text
                color={"#A0A3AD"}
                fontSize={"11px"}
                fontWeight={400}
                lineHeight={"22px"}
              >
                {transactionData?.toAddress === address
                  ? "This address"
                  : trimAddress({
                      address: transactionData?.toAddress,
                      firstChar: 6,
                    })}
              </Text>
            </Flex>
          )}
          <Flex cursor={"pointer"} onClick={openModal}>
            <Image src={TxLink} alt={"TxLink"} />
          </Flex>
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
        borderWidth={"1px"}
        backgroundColor={"#0F0F12"}
        borderColor={
          isOnOfficialStandard
            ? "rgba(0, 122, 255, 0.4)"
            : "rgba(219, 0, 255, 0.40)"
        }
      >
        <Flex alignItems="center">
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
              <Box w="4px" /> {/** space bar */}
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
        <PendingFooter transaction={transaction} openModal={openModal} />
      </Box>
    </>
  );
}
