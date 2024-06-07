// StatusComponent.tsx
import React, { useState, useEffect } from "react";
import { Flex, Box, Text, Circle } from "@chakra-ui/react";
import {
  TransactionHistory,
  Status,
  TransactionStatus,
} from "@/componenets/historyn/types";
import {
  convertTimeToMinutes,
  formatDateToYMD,
} from "@/componenets/historyn/utils/timeUtils";
import { TRANSACTION_CONSTANTS } from "@/componenets/historyn/constants";
import getStatusValue from "@/componenets/historyn/utils/historyStatus";

function getTimeDisplay(
  statusValue: number,
  transactionData: TransactionHistory
) {
  // 상수를 통해 정해진 시간을 추가해준다.
  switch (statusValue) {
    case TransactionStatus.WithdrawRollup: {
      console.log(transactionData);
      //   {
      //     "action": "Withdraw",
      //     "status": "Rollup",
      //     "inNetwork": "MAINNET",
      //     "outNetwork": "TITAN",
      //     "transactionHashes": {
      //         "initialTransactionHash": "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3"
      //     },
      //     "blockTimestamps": {
      //         "initialCompletedTimestamp": "1717315200"
      //     },
      //     "tokenSymbol": "ETH",
      //     "amount": "0.01234",
      //     "errorMessage": "Initial Error!"
      // }
      const timeValue = calculateInitialTime(
        statusValue,
        transactionData.blockTimestamps.initialCompletedTimestamp,
        TRANSACTION_CONSTANTS.WITHDRAW.INITIAL_MINUTES
      );

      return transactionData.errorMessage ? "11:11" : timeValue;
    }
    case TransactionStatus.WithdrawFinalized:
      return "22:22";
    case TransactionStatus.DepositFinalized:
      return "33:33";
    default:
      return "-";
  }
}

function calculateInitialTime(
  statusValue: number,
  blockTimestamp: string,
  additional: number
) {
  const initialTimestamp = Number(blockTimestamp);
  const countdownDuration =
    statusValue === TransactionStatus.WithdrawFinalized
      ? convertTimeToMinutes(additional, "days", 0) * 60
      : convertTimeToMinutes(additional, "minutes", 0) * 60;

  console.log(initialTimestamp);
  console.log(countdownDuration);
  const currentTime = Math.floor(Date.now() / 1000);
  console.log(currentTime);
  const remainingTime = countdownDuration - (currentTime - initialTimestamp);
  console.log(remainingTime);

  if (remainingTime <= 0) {
    return "00:00";
  }

  const minutes = String(Math.floor(remainingTime / 60)).padStart(2, "0");
  const seconds = String(remainingTime % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function useCountdown(initialTime: string) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time === "00:00") return;

    const countdown = setInterval(() => {
      const [minutes, seconds] = time.split(":").map(Number);
      const totalSeconds = minutes * 60 + seconds - 1;
      const newMinutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
      const newSeconds = String(totalSeconds % 60).padStart(2, "0");
      setTime(`${newMinutes}:${newSeconds}`);

      if (totalSeconds <= 0) {
        clearInterval(countdown);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [time]);

  return time;
}

interface TransactionStatusComponentProps {
  label: string;
  transactionData: TransactionHistory;
}

export default function StatusComponent(
  props: TransactionStatusComponentProps
) {
  const { label, transactionData } = props;
  const isActive = transactionData.status === label;

  const statusValue = getStatusValue(
    transactionData.action,
    transactionData.status
  );

  // 해당 조건일때만 카운트 다운 필요
  const shouldCountdown =
    (transactionData.status === Status.Rollup ||
      transactionData.status === Status.Finalized) &&
    isActive;

  const initialTimeDisplay = shouldCountdown
    ? // 카운트 다운 필요한 value
      getTimeDisplay(statusValue, transactionData)
    : // active 아닌 상태의 Finalized는 빈 값 출력
    !isActive && label === Status.Finalized
    ? ""
    : // 그 외는 모두 완료된 상태이므로 format 날짜 출력
      formatDateToYMD(
        Number(transactionData.blockTimestamps.initialCompletedTimestamp)
      );

  const timeDisplay = shouldCountdown
    ? useCountdown(initialTimeDisplay)
    : initialTimeDisplay;

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
        color={
          transactionData.errorMessage
            ? "#DD3A44"
            : isActive
            ? "#FFFFFF"
            : "#A0A3AD"
        }
      >
        {timeDisplay}
      </Text>
    </Flex>
  );
}
