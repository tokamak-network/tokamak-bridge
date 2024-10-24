import React, { useMemo } from "react";
import Image from "next/image";
import { Box, Flex, Text } from "@chakra-ui/react";
import GoogleCalendar from "@/assets/icons/newHistory/googleCalendar.svg";
import {
  Status,
  Action,
  TransactionHistory,
  isWithdrawTransactionHistory,
} from "@/staging/types/transaction";
import { TRANSACTION_CONSTANTS } from "@/staging/constants/transactionTime";
import { convertTimeToMinutes } from "@/staging/components/new-history/utils/timeUtils";
import { getRemainTime } from "@/staging/components/new-history/utils/getTimeDisplay";
import { formatTimeDisplay } from "@/staging/utils/formatTimeDisplay";
import { useCountdown } from "@/staging/hooks/useCountdown";
import Lightbulb from "@/assets/icons/newHistory/lightbulb.svg";
import Refresh from "@/assets/icons/newHistory/refresh.svg";
import { useCalendar } from "@/staging/hooks/useGoogleCalendar";
import GetHelp from "@/components/ui/GetHelp";

interface ConditionalBoxProps {
  type: "wait" | "timer" | "box";
  transactionData: TransactionHistory;
  waitMessage?: string | undefined;
  timeDisplay: string;
  isCountDown: boolean;
}

export default function ConditionalBox(props: ConditionalBoxProps) {
  const { type, transactionData, waitMessage, timeDisplay, isCountDown } = props;

  if (type === "wait") {
    return (
      <Box w={"100%"} h={"28px"} mt='3px' mb='21px' py='3px' bg='#15161D'>
        <Flex alignItems='center'>
          <Text
            fontWeight={400}
            fontSize='11px'
            lineHeight='18px'
            color='#59628D'
          >
            {waitMessage}
          </Text>
        </Flex>
      </Box>
    );
  }
  if (type === "timer") {
    const remainTime = getRemainTime(transactionData);
    const isZeroTime = remainTime <= 0;

    const errorRollup =
      transactionData.errorMessage && transactionData.status === Status.Rollup;

    const refreshRollup =
      (transactionData.status === Status.Rollup &&
        isZeroTime &&
        transactionData.action === Action.Withdraw) ||
      (transactionData.status === Status.Finalize &&
        isZeroTime &&
        transactionData.action === Action.Deposit);

    const calendarButton =
      transactionData.status === Status.Finalize &&
      !isZeroTime &&
      transactionData.action === Action.Withdraw;

    const claimReadyButton =
      transactionData.status === Status.Finalize &&
      isZeroTime &&
      transactionData.action === Action.Withdraw;

    if (claimReadyButton) {
      return <Box w={"100%"} mt='3px' mb='21px' py='3px' bg='#15161D'></Box>;
    }

    const startDate = useMemo(() => {
      if (
        isWithdrawTransactionHistory(transactionData) &&
        transactionData.blockTimestamps.rollupCompletedTimestamp
      ) {
        return new Date(
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

    return (
      <Box
        w={"100%"}
        h={"28px"}
        mt='3px'
        mb='21px'
        pl='12px'
        py='3px'
        borderRadius='4px'
        bg='#1F2128'
      >
        <Flex alignItems='center' w='100px'>
          <Text
            fontWeight={600}
            fontSize='11px'
            lineHeight='22px'
            color={errorRollup || !isCountDown ? "#DD3A44" : "#FFFFFF"}
            whiteSpace='nowrap'
            overflow='hidden'
          >
            {timeDisplay}
          </Text>
          {(errorRollup || !isCountDown) && (
            <GetHelp />
          )}
          {calendarButton && (
            <Flex
              w={"18px"}
              h={"18px"}
              ml={"6px"}
              justifyContent={"center"}
              cursor={"pointer"}
              onClick={handleCalendarClick}
            >
              <Image src={GoogleCalendar} alt={"GoogleCalendar"} />
            </Flex>
          )}
        </Flex>
      </Box>
    );
  }
  // Box type
  return <Box w={"100%"} mt='3px' mb='21px' py='3px' bg='#15161D' />;
}
