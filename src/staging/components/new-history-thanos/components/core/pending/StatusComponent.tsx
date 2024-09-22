// StatusComponent.tsx
import React, { useEffect, useMemo } from "react";
import { Flex, Text, Circle, Button } from "@chakra-ui/react";
import {
  TransactionHistory,
  Action,
  Status,
  isWithdrawTransactionHistory,
  isDepositTransactionHistory,
  HISTORY_TRANSACTION_STATUS,
  WithdrawTransactionHistory,
  CT_REQUEST,
  isInCT_REQUEST,
  isInCT_Provide,
  CT_PROVIDE,
  CT_REQUEST_CANCEL,
  isInCT_REQUEST_CANCEL,
  ERROR_CODE,
  ProgressStatus,
  StandardHistory,
} from "@/staging/types/transaction";
import useDepositWithdrawConfirmModal from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModal";
import { TRANSACTION_CONSTANTS } from "@/staging/constants/transactionTime";
import { convertTimeToMinutes } from "@/staging/components/new-history-thanos/utils/timeUtils";
import { formatDateToYMD } from "@/staging/components/new-history-thanos/utils/timeUtils";
import { useCountdown } from "@/staging/hooks/useCountdown";
import { getRemainTime } from "@/staging/components/new-history-thanos/utils/getTimeDisplay";
import { formatTimeDisplay } from "@/staging/utils/formatTimeDisplay";
import Image from "next/image";
import Lightbulb from "@/assets/icons/newHistory/lightbulb.svg";
import Refresh from "@/assets/icons/newHistory/refresh.svg";
import GoogleCalendar from "@/assets/icons/newHistory/googleCalendar.svg";
import { useCalendar } from "@/staging/hooks/useGoogleCalendar";
import { useFinalize } from "@/hooks/history/useFinalize";
import { useHistoryTab } from "@/staging/hooks/useHistoryTab";
import {
  getCurrentProgressStatus,
  shouldShowCalendarButton,
} from "../../../utils/historyStatus";
import { useInOutNetwork } from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import LampIcon from "@/assets/icons/lamp.svg";
import GetHelp from "@/components/ui/GetHelp";
import {
  useBridgeHistory,
  useDepositData,
} from "@/staging/hooks/useBridgeHistory";
import { getBridgeL2ChainId } from "@/staging/components/new-confirm/utils";
import ActionButtonComponent from "./actionButton";
import { CountDownComponent } from "./countDown";
import {
  bookGoogleEvent,
  getCalendarDetailsFromTx,
} from "../../../utils/googleCalendar";

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
const FinalizeButtonComponent = (props: {
  transactionData: WithdrawTransactionHistory;
}) => {
  const { callToFinalize } = useFinalize(props.transactionData);

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
      onClick={callToFinalize}
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
  const action = transactionData.action;
  const status = transactionData.status;
  const progressStatus = getCurrentProgressStatus(
    action as Action,
    transactionData.status as Status,
    label as Status,
    getBridgeL2ChainId(transactionData)
  );
  const isActive = transactionData.status === label;

  // Countdown is needed only for the following conditions
  const shouldCountdown =
    (action === Action.Deposit &&
      label === Status.Finalize &&
      progressStatus === ProgressStatus.Doing) ||
    (label === Status.Prove && status === Status.Initiated) ||
    (label === Status.Finalize && status === Status.Proved);

  const readyForStatus = action === Action.Withdraw && label === status;

  const remainTime = useMemo(() => {
    return getRemainTime(transactionData);
  }, [transactionData.status]);
  const initialTimeDisplay = shouldCountdown
    ? // Value needed for countdown
      formatTimeDisplay(remainTime)
    : // If not active and status is Finalized, display empty value
    progressStatus === ProgressStatus.Todo
    ? ""
    : // Otherwise, display formatted date as all are completed
      formatDateToYMD(Number(blockTimestamp ?? 0));

  const { time, isCountDown } = useCountdown(
    remainTime,
    Boolean(transactionData.errorMessage),
    transactionData
  );
  const timeDisplay = shouldCountdown ? time : initialTimeDisplay;

  // If error message exists and status is rollup, time increases and color turns red
  const errorRollup = transactionData.errorMessage && label === Status.Rollup;
  const errorRefund =
    transactionData.errorMessage === ERROR_CODE.CT_REFUND_NOT_COMPLETED &&
    label === CT_REQUEST_CANCEL.Refund;
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
  const isCalendar = shouldShowCalendarButton(
    transactionData as StandardHistory,
    label as Status
  );

  const handleCalendarButtonClick = () => {
    const calendarConfig = getCalendarDetailsFromTx(
      transactionData as StandardHistory,
      label as Status
    );
    bookGoogleEvent(calendarConfig);
  };

  // Show claim button when Finalized status is complete
  const claimReadyButton =
    label === Status.Finalize &&
    timeDisplay === "00 : 00" &&
    transactionData.action === Action.Withdraw;
  const { isOnOfficialStandard } = useHistoryTab();

  const statusTitle = useMemo(() => {
    if (isInCT_REQUEST(label)) {
      switch (label) {
        case CT_REQUEST.Request:
          return "Request";
        case CT_REQUEST.UpdateFee:
          return `Update ${
            updateFeeCount && updateFeeCount > 1 ? ` x ${updateFeeCount}` : ""
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
            progressStatus === ProgressStatus.Todo && !shouldCountdown
              ? "#A0A3AD"
              : "#007AFF"
          }
        />
        <Text
          ml={"6px"}
          fontSize={"11px"}
          fontWeight={600}
          lineHeight={"22px"}
          color={
            progressStatus === ProgressStatus.Doing || shouldCountdown
              ? "#FFFFFF"
              : "#A0A3AD"
          }
        >
          {statusTitle}
        </Text>
      </Flex>
      {readyForStatus ? (
        <ActionButtonComponent status={status} tx={transactionData} />
      ) : shouldCountdown ? (
        <CountDownComponent
          time={timeDisplay}
          isCountDown={isCountDown}
          handleCalendarButtonClick={
            isCalendar ? handleCalendarButtonClick : undefined
          }
        />
      ) : (
        <Text
          fontSize={"11px"}
          fontWeight={progressStatus === ProgressStatus.Doing ? 600 : 400}
          lineHeight={"22px"}
          color={
            isError
              ? "#DD3A44"
              : progressStatus === ProgressStatus.Doing || shouldCountdown
              ? "#FFFFFF"
              : "#A0A3AD"
          }
          cursor={!isActive ? "pointer" : "default"}
          onClick={!isActive ? openModal : undefined}
        >
          {timeDisplay}
        </Text>
      )}
    </Flex>
  );
}
