import React, { useState, useEffect } from "react";
import { Flex, Box, Text, Circle } from "@chakra-ui/react";
import {
  TransactionHistory,
  Status,
  Action,
  TransactionStatus,
} from "@/componenets/historyn/types";
import { TRANSACTION_CONSTANTS } from "@/componenets/historyn/constants";
import {
  convertTimeToMinutes,
  formatDateToYMD,
} from "@/componenets/historyn/utils/timeUtils";
import getStatusValue from "@/componenets/historyn/utils/historyStatus";

function getTimeDisplay(
  statusValue: number,
  transactionData: TransactionHistory
) {
  switch (statusValue) {
    case TransactionStatus.WithdrawRollup: {
      console.log(transactionData);
      return transactionData.errorMessage ? "11:11" : "00:00";
    }

    case TransactionStatus.WithdrawFinalized:
      return "22:22";
    case TransactionStatus.DepositFinalized:
      return "33:33";
    default:
      return "-";
  }
}

function displayTimeBasedOnStatus(
  label: string,
  isActive: boolean,
  transactionData: TransactionHistory
): string {
  const statusValue = getStatusValue(
    transactionData.action,
    transactionData.status
  );

  // 해당 조건일 때는 함수를 통해 시간을 생성한다.
  if (
    (transactionData.status === Status.Rollup ||
      transactionData.status === Status.Finalized) &&
    isActive
  ) {
    return getTimeDisplay(statusValue, transactionData);
    // rollup일때, finalize는 빈 값을 보여준다.
  } else if (!isActive && label === Status.Finalized) {
    return "";
  }

  // 그 외는 포맷 데이터를 보여준다.
  return formatDateToYMD(
    Number(transactionData.blockTimestamps.initialCompletedTimestamp)
  );
}

interface TransactionStatusComponentProps {
  label: string;
  transactionData: TransactionHistory;
}

export default function StatusComponent(
  props: TransactionStatusComponentProps
) {
  const { label, transactionData } = props;
  // console.log(transactionData);

  const isActive = transactionData.status === label;
  const timeDisplay = displayTimeBasedOnStatus(
    label,
    isActive,
    transactionData
  );

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"}>
      <Flex alignItems='center'>
        <Circle size='6px' bg={"#007AFF"} />
        <Text
          ml={"6px"}
          fontSize={"11px"}
          fontWeight={600}
          lineHeight={"22px"}
          color={isActive ? "#FFFFFF" : "#A0A3AD"}
        >
          {label}
        </Text>
      </Flex>
      <Text
        fontSize={"11px"}
        fontWeight={400}
        lineHeight={"22px"}
        color={isActive ? "#FFFFFF" : "#A0A3AD"}
      >
        {timeDisplay}
      </Text>
    </Flex>
  );
}
