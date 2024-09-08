import {
  Action,
  ProgressStatus,
  Status,
  TransactionHistory,
} from "@/staging/types/transaction";
import { Box, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import {
  getBridgeL2ChainId,
  getDepositWithdrawWaitMessage,
} from "../../../utils";

interface PendingComponentProps {
  pendingStatus: ProgressStatus;
  tx: TransactionHistory;
  label: Status;
}

interface TodoPendingComponentProps {
  message: string;
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
  return (
    <Box mt={`${mt}px`} mb={`${mb}px`}>
      {pendingStatus === ProgressStatus.Todo ? (
        <TodoPendingComponent message={pendingMessage} />
      ) : (
        <></>
      )}
    </Box>
  );
};

export default PendingComponent;
