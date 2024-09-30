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

export const thanosSepoliaDepositHistory = atom<CurrentDepositTransaction>({
  key: "thanosSepoliaDepositHistory",
  default: {
    latestBlockNumber: "0",
    latestRelayedBlockNumber: "0",
    history: null,
  },
});

export const thanosSepoliaWithdrawHistory = atom<CurrentWithdrawTransaction>({
  key: "thanosSepoliaWithdrawHistory",
  default: {
    latestBlockNumber: "0",
    history: null,
  },
});

export const titanSepoliaDepositHistory = atom<CurrentDepositTransaction>({
  key: "titanSepoliaDepositHistory",
  default: {
    latestBlockNumber: "0",
    history: null,
  } as CurrentDepositTransaction,
});

export const titanDepositHistory = atom<CurrentDepositTransaction>({
  key: "titanDepositHistory",
  default: {
    latestBlockNumber: "0",
    history: [],
  },
});

export const historyRefetch = atom<boolean>({
  key: "historyRefetch",
  default: false,
});
