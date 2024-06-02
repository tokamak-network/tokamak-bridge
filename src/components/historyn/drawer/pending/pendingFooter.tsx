import { Flex, Box, Text, Circle } from "@chakra-ui/react";
import {
  TransactionHistory,
  Status,
  Action,
} from "@/componenets/historyn/types";
import {
  convertTimeToMinutes,
  formatDateToYMD,
} from "@/componenets/historyn/utils/timeUtils";
import StatusComponent from "@/components/historyn/drawer/pending/StatusComponent";

export default function PendingFooter(transaction: TransactionHistory) {
  const transactionData = transaction;
  console.log(transactionData);
  console.log(
    formatDateToYMD(
      Number(transactionData.blockTimestamps.initialCompletedTimestamp)
    )
  );

  const statusConfig = {
    withdraw: [Status.Initial, Status.Rollup, Status.Finalized],
    deposit: [Status.Initial, Status.Finalized],
  };

  const statuses =
    transactionData.action === Action.Withdraw
      ? statusConfig.withdraw
      : statusConfig.deposit;

  return (
    <>
      {statuses.map((statusKey, index) => (
        <StatusComponent
          key={index}
          label={statusKey}
          transactionData={transactionData}
        />
      ))}
    </>
  );
}
