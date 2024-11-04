import {
  Action,
  CT_ACTION,
  CurrentDepositTransaction,
  CurrentWithdrawTransaction,
  DepositTransactionHistory,
  HISTORY_SORT,
} from "@/staging/types/transaction";
import { atom } from "recoil";

export const userTransactions = atom<any>({
  key: "userTransactions",
  default: undefined,
});

export const selectedTab = atom<HISTORY_SORT>({
  key: "selectedTab",
  default: HISTORY_SORT.STANDARD,
});

export const selectedTransactionCategory = atom<Action | CT_ACTION>({
  key: "selectedTransactionCategory",
  default: Action.Deposit,
});

export const thanosDepositHistory = atom<CurrentDepositTransaction>({
  key: "thanosDepositHistory",
  default: {
    latestBlockNumber: "0",
    latestRelayedBlockNumber: "0",
    history: null,
  },
});

export const thanosWithdrawHistory = atom<CurrentWithdrawTransaction>({
  key: "thanosWithdrawHistory",
  default: {
    latestBlockNumber: "0",
    history: null,
  },
});

export const titanWithdrawHistory = atom<CurrentWithdrawTransaction>({
  key: "titanWithdrawHistory",
  default: {
    latestBlockNumber: "0",
    history: null,
  },
});

export const titanDepositHistory = atom<CurrentDepositTransaction>({
  key: "titanDepositHistory",
  default: {
    latestBlockNumber: "0",
    history: null,
  } as CurrentDepositTransaction,
});

export const historyRefetch = atom<boolean>({
  key: "historyRefetch",
  default: false,
});

