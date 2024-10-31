import { Action, CT_ACTION, DepositTransactionHistory, HISTORY_SORT, WithdrawTransactionHistory } from "@/staging/types/transaction";
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


export const depositTxHistory = atom<DepositTransactionHistory[] | null>({
  key: "depositTransactionHistory",
  default: null,
});

export const withdrawTxHistory = atom<WithdrawTransactionHistory[] | null>({
  key: "withdrawTransactionHistory",
  default: null,
});