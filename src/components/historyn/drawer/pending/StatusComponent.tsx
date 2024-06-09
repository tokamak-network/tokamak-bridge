// StatusComponent.tsx
import React, { useMemo } from "react";
import { Flex, Text, Circle, Button } from "@chakra-ui/react";
import {
  TransactionHistory,
  Action,
  Status,
  isWithdrawTransactionHistory,
} from "@/componenets/historyn/types";
import { TRANSACTION_CONSTANTS } from "@/components/historyn/constants";
import { convertTimeToMinutes } from "@/components/historyn/utils/timeUtils";
import { formatDateToYMD } from "@/componenets/historyn/utils/timeUtils";
import { useCountdown } from "@/components/historyn/hooks/useCountdown";
import { getTimeDisplay } from "@/componenets/historyn/utils/getTimeDisplay";
import Image from "next/image";
import Lightbulb from "@/assets/icons/newHistory/lightbulb.svg";
import Refresh from "@/assets/icons/newHistory/refresh.svg";
import GoogleCalendar from "@/assets/icons/newHistory/googleCalendar.svg";
import { useCalendar } from "@/components/historyn/hooks/useGoogleCalendar";

interface TransactionStatusComponentProps {
  label: string;
  transactionData: TransactionHistory;
}

export default function StatusComponent(
  props: TransactionStatusComponentProps
) {
  const { label, transactionData } = props;
  const isActive = transactionData.status === label;

  // Countdown is needed only for the following conditions
  const shouldCountdown =
    (transactionData.status === Status.Rollup ||
      transactionData.status === Status.Finalized) &&
    isActive;

  const initialTimeDisplay = shouldCountdown
    ? // Value needed for countdown
      getTimeDisplay(transactionData)
    : // If not active and status is Finalized, display empty value
    !isActive && label === Status.Finalized
    ? ""
    : // Otherwise, display formatted date as all are completed
      formatDateToYMD(
        Number(transactionData.blockTimestamps.initialCompletedTimestamp)
      );

  // Output variable
  const timeDisplay = shouldCountdown
    ? useCountdown(initialTimeDisplay, Boolean(transactionData.errorMessage))
    : initialTimeDisplay;

  // Calendar start time
  const startDate = useMemo(() => {
    if (
      // Use type guard as rollup exists only for withdraw condition
      isWithdrawTransactionHistory(transactionData) &&
      transactionData.blockTimestamps.rollupCompletedTimestamp
    ) {
      return new Date(
        // Calculate rollup 7 days
        (Number(transactionData.blockTimestamps.rollupCompletedTimestamp) +
          convertTimeToMinutes(
            TRANSACTION_CONSTANTS.WITHDRAW.ROLLUP_DAYS,
            "days",
            0
          ) *
            60) *
          1000
      );
    }
    return null;
  }, [transactionData]);

  const { handleCalendarClick } = useCalendar(startDate);

  // If error message exists and status is rollup, time increases and color turns red
  const errorRollup = transactionData.errorMessage && label === Status.Rollup;

  // When initial phase ends, display refresh icon to fetch new values via query
  const refreshRollup = label === Status.Rollup && timeDisplay === "00 : 00";

  // Display calendar button
  const calendarButton =
    label === Status.Finalized &&
    timeDisplay !== "00 : 00" &&
    isActive &&
    transactionData.action === Action.Withdraw;

  // Show claim button when Finalized status is complete
  const claimReadyButton =
    label === Status.Finalized &&
    timeDisplay === "00 : 00" &&
    transactionData.action === Action.Withdraw;

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
        {calendarButton && (
          <Flex
            w={"18px"}
            h={"18px"}
            ml={"6px"}
            justifyContent={"center"}
            onClick={handleCalendarClick}
          >
            <Image src={GoogleCalendar} alt={"GoogleCalendar"} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
