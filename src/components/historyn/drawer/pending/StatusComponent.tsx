// StatusComponent.tsx
import React, { useState, useMemo } from "react";
import { Flex, Text, Circle, Button } from "@chakra-ui/react";
import {
  TransactionHistory,
  Action,
  Status,
} from "@/componenets/historyn/types";
import { TRANSACTION_CONSTANTS } from "@/components/historyn/constants";
import { convertTimeToMinutes } from "@/components/historyn/utils/timeUtils";
import { formatDateToYMD } from "@/componenets/historyn/utils/timeUtils";
import { useCountdown } from "@/components/historyn/hooks/useCountdown";
import { getTimeDisplay } from "@/componenets/historyn/utils/getTimeDisplay";
import Image from "next/image";
import { atcb_action } from "add-to-calendar-button";
import { format, addHours } from "date-fns";
import Lightbulb from "@/assets/icons/newHistory/lightbulb.svg";
import Refresh from "@/assets/icons/newHistory/refresh.svg";
import GoogleCalendar from "@/assets/icons/newHistory/googleCalendar.svg";
import { useCalendarConfig } from "@/components/historyn/hooks/useGoogleCalendar";

interface TransactionStatusComponentProps {
  label: string;
  transactionData: TransactionHistory;
}

export default function StatusComponent(
  props: TransactionStatusComponentProps
) {
  const { label, transactionData } = props;
  const isActive = transactionData.status === label;

  // 해당 조건일때만 카운트 다운 필요
  const shouldCountdown =
    (transactionData.status === Status.Rollup ||
      transactionData.status === Status.Finalized) &&
    isActive;

  const initialTimeDisplay = shouldCountdown
    ? // 카운트 다운 필요한 value
      getTimeDisplay(transactionData)
    : // active 아닌 상태의 Finalized는 빈 값 출력
    !isActive && label === Status.Finalized
    ? ""
    : // 그 외는 모두 완료된 상태이므로 format 날짜 출력
      formatDateToYMD(
        Number(transactionData.blockTimestamps.initialCompletedTimestamp)
      );

  // 출력 변수
  const timeDisplay = shouldCountdown
    ? useCountdown(initialTimeDisplay, Boolean(transactionData.errorMessage))
    : initialTimeDisplay;

  //error message가 존재하고, Status가 rollup인 경우 시간이 증가하고, 색상이 red가 된다.
  const errorRollup = transactionData.errorMessage && label === Status.Rollup;

  //initial이 종료되면, 쿼리를 통해 새로운 값을 받아올 수 있도록 refresh 아이콘을 출력해 준다.
  const refreshRollup = label === Status.Rollup && timeDisplay === "00:00";

  // 캘린더 버튼 표시
  const calendarButton =
    label === Status.Finalized &&
    timeDisplay !== "00:00" &&
    isActive &&
    transactionData.action === Action.Withdraw;

  // Finalized상태에서 완료 되면, claim버튼 show
  const claimReadyButton =
    label === Status.Finalized &&
    timeDisplay === "00:00" &&
    transactionData.action === Action.Withdraw;

  const calendarConfig = useMemo(() => {
    if (calendarButton) {
      const statusDuration = convertTimeToMinutes(
        TRANSACTION_CONSTANTS.WITHDRAW.ROLLUP_DAYS,
        "days",
        0
      );
      const startDate = new Date(
        (Number(transactionData.blockTimestamps.rollupCompletedTimestamp) +
          statusDuration * 60) *
          1000
      );
      const formattedDate = format(startDate, "yyyy-MM-dd");
      const startTime = format(startDate, "HH:mm");
      const endTime = format(addHours(startDate, 1), "HH:mm");

      return {
        name: "Claim withdrawal on Ethereum network using Tokamak Bridge",
        description:
          "How to claim:\n1. Go to Tokamak Bridge (https://bridge.tokamak.network/) \n2. Connect to your wallet \n3. Click the wallet address on the top right  \n4. Find the relevant claim transaction and click “Claim”  ",
        startDate: formattedDate,
        startTime: startTime,
        endTime: endTime,
        options: ["Google" as const],
        timeZone: "currentBrowser",
      };
    }
    return null;
  }, [calendarButton]);

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
      <Flex alignItems='center'>
        {claimReadyButton ? (
          <Button
            w={"60px"}
            h={"22px"}
            px={"9px"}
            py={"8px"}
            justifyContent={"center"}
            gap={"8px"}
            flexShrink={0}
            borderRadius={"4px"}
            bg={"#007AFF"}
          >
            <Text fontWeight={600} fontSize={"11px"} lineHeight={"16.5px"}>
              Finalize
            </Text>
          </Button>
        ) : (
          <Text
            fontSize={"11px"}
            fontWeight={400}
            lineHeight={"22px"}
            color={errorRollup ? "#DD3A44" : isActive ? "#FFFFFF" : "#A0A3AD"}
          >
            {timeDisplay}
          </Text>
        )}

        {errorRollup && (
          <Flex w={"18px"} h={"18px"} ml={"2px"} justifyContent={"center"}>
            <Image src={Lightbulb} alt={"Lightbulb"} />
          </Flex>
        )}
        {refreshRollup && (
          <Flex w={"18px"} h={"18px"} ml={"2px"} justifyContent={"center"}>
            <Image src={Refresh} alt={"Refresh"} />
          </Flex>
        )}
        {calendarButton && calendarConfig && (
          <Flex
            w={"18px"}
            h={"18px"}
            ml={"2px"}
            justifyContent={"center"}
            onClick={() => atcb_action(calendarConfig)}
          >
            <Image src={GoogleCalendar} alt={"GoogleCalendar"} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
