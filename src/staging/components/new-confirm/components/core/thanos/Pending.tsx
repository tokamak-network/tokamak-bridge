import {
  Action,
  ProgressStatus,
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
  status: Status;
  isCountdown: boolean;
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
  status,
  isCountdown,
}) => {
  return (
    <Flex h={"28px"} pl="12px" py="3px" borderRadius="4px" bg="#1F2128">
      <Flex gap={"2px"} alignItems={"center"}>
        <Text
          color={isCountdown ? "white" : "#DD3A44"}
          fontSize={"11px"}
          fontWeight={600}
          lineHeight={"normal"}
        >
          {timeDisplay}
        </Text>
        {!isCountdown && (
          <Flex
            w={"18px"}
            h={"18px"}
            ml={"2px"}
            justifyContent={"center"}
            cursor={"pointer"}
          >
            <GetHelp />
          </Flex>
        )}
      </Flex>
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
  return (
    <Box mt={`${mt}px`} mb={`${mb}px`}>
      {pendingStatus === ProgressStatus.Todo ? (
        <TodoPendingComponent message={pendingMessage} />
      ) : pendingStatus === ProgressStatus.Doing ? (
        <DoingPendingComponent
          timeDisplay={timeDisplay}
          status={label}
          isCountdown={isCountDown}
        />
      ) : (
        <></>
      )}
    </Box>
  );
};

export default PendingComponent;
