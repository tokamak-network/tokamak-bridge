// StatusComponent.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Flex, Text, Circle, Button } from "@chakra-ui/react";
import {
  TransactionHistory,
  Action,
  Status,
  isWithdrawTransactionHistory,
  isDepositTransactionHistory,
  HISTORY_TRANSACTION_STATUS,
  CT_REQUEST,
  isInCT_REQUEST,
  isInCT_Provide,
  CT_PROVIDE,
  CT_REQUEST_CANCEL,
  isInCT_REQUEST_CANCEL,
  ERROR_CODE,
} from "@/staging/types/transaction";
import { TRANSACTION_CONSTANTS } from "@/staging/constants/transactionTime";
import { convertTimeToMinutes } from "@/staging/components/new-history/utils/timeUtils";
import { formatDateToYMD } from "@/staging/components/new-history/utils/timeUtils";
import { useCountdown } from "@/staging/hooks/useCountdown";
import { getRemainTime } from "@/staging/components/new-history-thanos/utils/getTimeDisplay";
import { formatTimeDisplay } from "@/staging/utils/formatTimeDisplay";
import Image from "next/image";
import Lightbulb from "@/assets/icons/newHistory/lightbulb.svg";
import Refresh from "@/assets/icons/newHistory/refresh.svg";
import GoogleCalendar from "@/assets/icons/newHistory/googleCalendar.svg";
import { useCalendar } from "@/staging/hooks/useGoogleCalendar";
import { useHistoryTab } from "@/staging/hooks/useHistoryTab";
import { useTimeOver } from "@/hooks/time/useTimeOver";
import GetHelp from "@/components/ui/GetHelp";

type TransactionStatusComponentProps = {
  label: HISTORY_TRANSACTION_STATUS;
  transactionData: TransactionHistory;
  openModal: () => void;
  blockTimestamp?: number;
  updateFeeCount?: number;
};

export const ErrorRollupComponent = () => {
  return (
    <Flex
      w={"18px"}
      h={"18px"}
      ml={"2px"}
      justifyContent={"center"}
      cursor={"pointer"}
    >
      <Image src={Lightbulb} alt={"Lightbulb"} />
    </Flex>
  );
};
const RefreshRollupComponent = () => {
  return (
    <Flex
      w={"18px"}
      h={"18px"}
      ml={"2px"}
      justifyContent={"center"}
      cursor={"pointer"}
    >
      <Image src={Refresh} alt={"Refresh"} />
    </Flex>
  );
};
const CalenderButtonComponent = (props: {
  handleCalendarClick: () => void;
}) => {
  return (
    <Flex
      w={"18px"}
      h={"18px"}
      ml={"6px"}
      justifyContent={"center"}
      cursor={"pointer"}
      onClick={props.handleCalendarClick}
    >
      <Image src={GoogleCalendar} alt={"GoogleCalendar"} />
    </Flex>
  );
};
const FinalizeButtonComponent = (props: { openModal: () => void }) => {
  return (
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
      _active={{}}
      _hover={{}}
      _focus={{}}
      onClick={props.openModal}
    >
      <Text fontWeight={600} fontSize={"11px"} lineHeight={"16.5px"}>
        Finalize
      </Text>
    </Button>
  );
};

export default function StatusComponent(
  props: TransactionStatusComponentProps
) {
  const { label, transactionData, blockTimestamp, updateFeeCount, openModal } =
    props;
  const finalizeStage =
    transactionData.status === Status.Initiate && label === "Finalize";
  const rollupStage =
    transactionData.status === Status.Initiate && label === "Rollup";
  const isActive =
    //for Deposit Finalize
    (transactionData.status !== Status.Initiate && finalizeStage) ||
    //for Withdraw Rollup
    rollupStage ||
    (transactionData.status === label &&
      transactionData.status !== Status.Initiate);

  // Countdown is needed only for the following conditions
  const shouldCountdown =
    (transactionData.status === Status.Rollup ||
      transactionData.status === Status.Finalize ||
      finalizeStage ||
      rollupStage ||
      transactionData.status === CT_REQUEST_CANCEL.Refund ||
      transactionData.status === CT_PROVIDE.Return) &&
    isActive;

  const remainTime = useMemo(() => {
    return getRemainTime(transactionData);
  }, [transactionData.status]);

  const initialTimeDisplay = shouldCountdown
    ? // Value needed for countdown
    formatTimeDisplay(getRemainTime(transactionData))
    : // If not active and status is Finalized, display empty value
    (!isActive && label.toString() === "Finalize") ||
      (isActive && label === CT_REQUEST.WaitForReceive)
      ? ""
      : // Otherwise, display formatted date as all are completed
      formatDateToYMD(
        Number(
          isWithdrawTransactionHistory(transactionData) ||
            isDepositTransactionHistory(transactionData)
            ? transactionData.blockTimestamps.initialCompletedTimestamp
            : blockTimestamp ?? 0
        )
      );

  const { isTimeOver } = useTimeOver({
    timeStamp: Number(blockTimestamp),
    //refund and return have same timeBuffer as 300s
    timeBuffer: TRANSACTION_CONSTANTS.CROSS_TRADE.RETURN_LIQUIDITY,
    needToCheck: shouldCountdown,
  });

  const { time, isCountDown } = useCountdown(
    remainTime,
    Boolean(transactionData.errorMessage),
    transactionData
  );

  // Output variable
  const timeDisplay = shouldCountdown
    ? time
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
  const errorRefund =
    (transactionData.errorMessage === ERROR_CODE.CT_REFUND_NOT_COMPLETED &&
      label === CT_REQUEST_CANCEL.Refund) ||
    isTimeOver;
  const errorReturnLiquidity =
    transactionData.errorMessage === ERROR_CODE.CT_LIQUIDITY_NOT_RETURNED &&
    label === CT_PROVIDE.Return;
  const isError = errorRollup || errorRefund || errorReturnLiquidity;

  // When initial phase ends, display refresh icon to fetch new values via query
  const refreshRollup =
    (label === Status.Rollup &&
      timeDisplay === "00 : 00" &&
      transactionData.action === Action.Withdraw) ||
    (label === Status.Finalize &&
      timeDisplay === "00 : 00" &&
      transactionData.action === Action.Deposit);

  // Display calendar button
  const calendarButton =
    label === Status.Finalize &&
    timeDisplay !== "00 : 00" &&
    isActive &&
    transactionData.action === Action.Withdraw;

  // Show claim button when Finalized status is complete
  const claimReadyButton =
    label === Status.Finalize &&
    remainTime < 0 &&
    transactionData.action === Action.Withdraw;
  const { isOnOfficialStandard } = useHistoryTab();

  const statusTitle = useMemo(() => {
    if (isInCT_REQUEST(label)) {
      switch (label) {
        case CT_REQUEST.Request:
          return "Request";
        case CT_REQUEST.UpdateFee:
          return `Update ${updateFeeCount && updateFeeCount > 1 ? ` x ${updateFeeCount}` : ""
            }`;
        case CT_REQUEST.WaitForReceive:
          return "Waiting";
        default:
          return;
      }
    }
    if (isInCT_REQUEST_CANCEL(label)) {
      switch (label) {
        case CT_REQUEST_CANCEL.Request:
          return "Request";
        case CT_REQUEST_CANCEL.CancelRequest:
          return "Cancel";
        case CT_REQUEST_CANCEL.Refund:
          return "Refund";
        default:
          return;
      }
    }
    if (isInCT_Provide(label)) {
      switch (label) {
        case CT_PROVIDE.Provide:
          return "Provide";
        case CT_PROVIDE.Return:
          return "Receive";
        default:
          return;
      }
    }
    return label;
  }, [label, updateFeeCount]);

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"}>
      <Flex alignItems="center">
        <Circle
          size="6px"
          bg={
            !isActive && label === Status.Finalize
              ? "#A0A3AD"
              : isOnOfficialStandard
                ? "#007AFF"
                : "#DB00FF"
          }
        />
        <Text
          ml={"6px"}
          fontSize={"11px"}
          fontWeight={600}
          lineHeight={"22px"}
          color={isActive ? "#FFFFFF" : "#A0A3AD"}
        >
          {statusTitle}
        </Text>
      </Flex>
      <Flex alignItems="center">
        {claimReadyButton ? (
          <FinalizeButtonComponent openModal={openModal} />
        ) : (
          <Text
            fontSize={"11px"}
            fontWeight={shouldCountdown ? 600 : 400}
            lineHeight={"22px"}
            color={shouldCountdown && (isError || !isCountDown) ? "#DD3A44" : isActive ? "#FFFFFF" : "#A0A3AD"}
            cursor={!isActive ? "pointer" : "default"}
            onClick={!isActive ? openModal : undefined}
          >
            {timeDisplay}
          </Text>
        )}
        {!claimReadyButton && shouldCountdown && !isCountDown && <GetHelp />}
        {!claimReadyButton && calendarButton && (
          <CalenderButtonComponent handleCalendarClick={handleCalendarClick} />
        )}
      </Flex>
    </Flex>
  );
}
