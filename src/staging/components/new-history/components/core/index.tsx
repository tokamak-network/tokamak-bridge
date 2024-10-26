import React, { useEffect, useMemo, useState } from "react";
import { Flex, Box, Text, useStatStyles } from "@chakra-ui/react";
import {
  Action,
  CT_ACTION,
  CT_PROVIDE,
  CT_REQUEST,
  CT_REQUEST_CANCEL,
  isDepositTransactionHistory,
  isWithdrawTransactionHistory,
  Status,
} from "@/staging/types/transaction";
import Pending from "@/staging/components/new-history-thanos/components/core/pending";
import Complete from "@/staging/components/new-history-thanos/components/core/complete";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  selectedTransactionCategory,
} from "@/recoil/history/transaction";
import Image from "next/image";
import NoAcitivity from "@/assets/icons/accountHistory/noActivityIcon.svg";
import GradientSpinner from "@/components/ui/GradientSpinner";
import useMediaView from "@/hooks/mediaView/useMediaView";
import LoadingTx from "@/components/history/LoadingTx";
import { useBridgeHistory } from "@/staging/hooks/bridge/useBridgeHistory";

const NoAcitivityComponent = () => {
  return (
    <Flex
      flexDir={"column"}
      rowGap={"24px"}
      alignItems={"center"}
      justifyContent={"center"}
      h={"640px"}
    >
      <Image src={NoAcitivity} alt={"noActivityIcon"}></Image>
      <Text color={"#E3F3FF"}>No activity yet</Text>
    </Flex>
  );
};

const LoadingTxSpinners = () => {
  const { mobileView } = useMediaView();
  return (
    <Flex w={mobileView ? "100%" : "336px"} flexDir={"column"} rowGap={"8px"}>
      <GradientSpinner />
      <GradientSpinner />
      <GradientSpinner />
    </Flex>
  );
};

export default function AccountHistoryNew() {
  const { mobileView } = useMediaView();
  const { depositHistory, withdrawHistory, requestHistory, provideHistory } =
    useBridgeHistory();
  const _selectedTransactionCategory = useRecoilValue(
    selectedTransactionCategory
  );


  const historyData = useMemo(() => {
    switch (_selectedTransactionCategory) {
      case Action.Deposit:
        return depositHistory;
      case Action.Withdraw:
        return withdrawHistory;
      case CT_ACTION.REQUEST:
        return requestHistory;
      case CT_ACTION.PROVIDE:
        return provideHistory;
      default:
        return;
    }
  }, [
    _selectedTransactionCategory,
    depositHistory,
    withdrawHistory,
    requestHistory,
    provideHistory,
  ]);

  return (
    <Flex
      w={mobileView ? "calc(100% - 8px)" : "336px"}
      flexDirection="column"
      gap="2"
      h={"100%"}
    >
      {!historyData && <LoadingTxSpinners />}
      {historyData?.length === 0 && <NoAcitivityComponent />}
      {historyData?.map((transaction, index) => {
        const isCompleted =
          transaction.status === Status.Completed ||
          transaction.status === CT_REQUEST.Completed ||
          transaction.status === CT_REQUEST_CANCEL.Completed ||
          transaction.status === CT_PROVIDE.Completed;
        const key =
          isDepositTransactionHistory(transaction) ||
            isWithdrawTransactionHistory(transaction)
            ? transaction.transactionHashes.initialTransactionHash
            : index;
        return (
          <Box
            key={`${transaction.action}-${key}`}
            px={"12px"}
            py={isCompleted ? "6px" : "8px"}
            borderRadius={"8px"}
            border={isCompleted ? "none" : "1px solid #313442"}
            bg={"#15161D"}
          >
            {/** In the history, Pending shows the current incomplete screen, and Complete shows the completed screen. */}
            {isCompleted ? (
              <Complete {...transaction} />
            ) : (
              <Pending transaction={transaction} />
            )}
          </Box>
        );
      })}
    </Flex>
  );
}
