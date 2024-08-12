import {
  Status,
  Action,
  TransactionHistory,
} from "@/staging/types/transaction";
import { getRemainTime } from "@/staging/components/new-history/utils/getTimeDisplay";
import { TRANSACTION_CONSTANTS } from "@/staging/constants/transactionTime";

//getConfirmType.ts
const getLineType = (transactionData: TransactionHistory): number => {
  if (transactionData.action === Action.Withdraw) {
    switch (transactionData.status) {
      case Status.Initiate:
        // 1. type: wait, waitMessage: "Wait 1~11 min"
        // 2. type: wait, waitMessage: "Wait 7 days"
        return 0;
      case Status.Rollup:
        // 1. type: timer
        // 2. type: wait, waitMessage: "Wait 7 days"
        return 1;
      case Status.Finalize:
        const remainTime = getRemainTime(transactionData);
        const isZeroTime = remainTime <= 0;
        if (isZeroTime) {
          // 1. type: box
          // 2. type: box
          return 3;
        }
        // 1. type: box
        // 2. type: timer
        return 2;
      case Status.Completed:
        // 1. type: box
        // 2. type: box
        return 4;
    }
  }
  if (transactionData.action === Action.Deposit) {
    switch (transactionData.status) {
      case Status.Initiate:
        // 1. type: wait, waitMessage: "Wait 1 min"
        return 100;
      case Status.Finalize:
        // 1. type: timer
        return 101;
      case Status.Completed:
        // 1. type: box
        return 102;
    }
  }
  return 9999; // no type
};
{
  /**
   * The box component has various patterns depending on the type. @Robert
   * wait: Includes a message (getWaitMessage).
   * timer: Includes a timer.
   * box: No design and has margins set.
   */
}
type ConditionalBoxType = "timer" | "wait" | "box";
const getType = (lineType: number, index: number) => {
  const typeMap: Record<number, ConditionalBoxType> = {
    0: "wait",
    1: index === 0 ? "timer" : "wait",
    2: index === 0 ? "box" : "timer",
    3: "box",
    4: "box",
    100: "wait",
    101: "timer",
    102: "box",
  };
  return typeMap[lineType] || undefined;
};

const getWaitMessage = (lineType: number, index: number) => {
  const waitMessageMap: Record<number, string> = {
    0:
      index === 0
        ? "Wait 6 hours"
        : `Wait ${TRANSACTION_CONSTANTS.WITHDRAW.ROLLUP_DAYS} days`,
    1: `Wait ${TRANSACTION_CONSTANTS.WITHDRAW.ROLLUP_DAYS} days`,
    100: `Wait ${TRANSACTION_CONSTANTS.DEPOSIT.INITIAL_MINUTES} min`,
  };
  return waitMessageMap[lineType] || undefined;
};

export { getLineType, getType, getWaitMessage };
