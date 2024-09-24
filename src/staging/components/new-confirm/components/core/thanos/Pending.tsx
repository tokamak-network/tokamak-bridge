import {
  Action,
  ProgressStatus,
  StandardHistory,
  Status,
  TransactionHistory,
} from "@/staging/types/transaction";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import {
  getBridgeL2ChainId,
  getDepositWithdrawWaitMessage,
} from "../../../utils";
import { getRemainTime } from "@/staging/components/new-history-thanos/utils/getTimeDisplay";
import { useCountdown } from "@/staging/hooks/useCountdown";
import GetHelp from "@/components/ui/GetHelp";
import { CountDownComponent } from "@/staging/components/new-history-thanos/components/core/pending/countDown";
import {
  bookGoogleEvent,
  getCalendarDetailsFromTx,
} from "@/staging/components/new-history-thanos/utils/googleCalendar";
import { shouldShowCalendarButton } from "@/staging/components/new-history-thanos/utils/historyStatus";

interface PendingComponentProps {
  pendingStatus: ProgressStatus;
  tx: TransactionHistory;
  label: Status;
}

interface TodoPendingComponentProps {
  message: string;
}

interface DoingPendingComponentProps {
  timeDisplay: string;
  isCountdown: boolean;
  handleCalendarClick?: () => void;
}

const TodoPendingComponent: React.FC<TodoPendingComponentProps> = ({
  message,
}) => {
  return (
    <Text
      color={"#59628D"}
      fontSize={"11px"}
      fontWeight={400}
      lineHeight={"18px"}
    >
      {message}
    </Text>
  );
};

const DoingPendingComponent: React.FC<DoingPendingComponentProps> = ({
  timeDisplay,
  isCountdown,
  handleCalendarClick,
}) => {
  return (
    <Flex h={"28px"} pl="12px" py="3px" borderRadius="4px" bg="#1F2128">
      <CountDownComponent
        time={timeDisplay}
        isCountDown={isCountdown}
        handleCalendarButtonClick={handleCalendarClick}
      />
    </Flex>
  );
};

const PendingComponent: React.FC<PendingComponentProps> = ({
  pendingStatus,
  tx,
  label,
}) => {
  const getMargins = useCallback(() => {
    switch (pendingStatus) {
      case ProgressStatus.Todo:
        return { mt: 8, mb: 26 };
      case ProgressStatus.Doing:
        return { mt: 3, mb: 21 };
      case ProgressStatus.Done:
        return { mt: 0, mb: 24 };
      default:
        return { mt: 0, mb: 24 };
    }
  }, [pendingStatus]);
  const { mt, mb } = getMargins();
  const pendingMessage = getDepositWithdrawWaitMessage(
    label,
    tx.action as Action,
    getBridgeL2ChainId(tx)
  );
  const remainTime = useMemo(() => {
    return getRemainTime(tx);
  }, [tx]);
  const { time: timeDisplay, isCountDown } = useCountdown(
    remainTime,
    false,
    tx
  );
  const isCalendar = shouldShowCalendarButton(
    tx as StandardHistory,
    label as Status
  );
  const handleCalendarButtonClick = () => {
    const calendarConfig = getCalendarDetailsFromTx(tx as StandardHistory);
    bookGoogleEvent(calendarConfig);
  };
  return (
    <Box mt={`${mt}px`} mb={`${mb}px`}>
      {pendingStatus === ProgressStatus.Todo ? (
        <TodoPendingComponent message={pendingMessage} />
      ) : pendingStatus === ProgressStatus.Doing ? (
        <DoingPendingComponent
          timeDisplay={timeDisplay}
          isCountdown={isCountDown}
          handleCalendarClick={
            isCalendar ? handleCalendarButtonClick : undefined
          }
        />
      ) : (
        <></>
      )}
    </Box>
  );
};

export default PendingComponent;
