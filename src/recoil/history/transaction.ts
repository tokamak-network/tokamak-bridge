import { Action, CT_ACTION, HISTORY_SORT } from "@/staging/types/transaction";
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
