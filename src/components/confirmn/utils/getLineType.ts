//historyStatus.ts
import {
  Status,
  Action,
  TransactionHistory,
} from "@/components/historyn/types";
import { getTimeDisplay } from "@/components/historyn/utils/getTimeDisplay";

const getLineType = (transactionData: TransactionHistory): number => {
  if (transactionData.action === Action.Withdraw) {
    switch (transactionData.status) {
      case Status.Initiate:
        return 0; // 1. type : wait,  waitMessage : "Wait 1~11 min" 2. type : wait, waitMessage : "Wait 7 days"
      case Status.Rollup:
        return 1; // 1. type : timer,  2. type : wait , waitMessage : "Wait 7 days"
      case Status.Finalize:
        const initialTimeDisplay = getTimeDisplay(transactionData);
        if (initialTimeDisplay === "00 : 00") {
          return 3; // 1. type : box,  2. type : box
        }
        return 2; // 1. type : box 2. type : timer
      case Status.Completed:
        return 4; // 1. type : box,  2. type : box
    }
  } else if (transactionData.action === Action.Deposit) {
    switch (transactionData.status) {
      case Status.Initiate:
        return 100; // 1. type : wait, waitMessage : "Wait 1 min"
      case Status.Finalize:
        return 101; // 1. type : timer
      case Status.Completed:
        return 102; // 1. type box
    }
  }
  return 9999; // no type
};

export default getLineType;
