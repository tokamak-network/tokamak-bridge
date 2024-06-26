import { atom } from "recoil";

export const userTransactions = atom<any>({
  key: "userTransactions",
  default: undefined,
});

export const selectedTab = atom<"OfficialStandard" | "CorssTrade">({
  key: "selectedTab",
  default: "OfficialStandard",
});

export const selectedTransactionCategory = atom<"Deposit" | "Withdraw">({
  key: "selectedTransactionCategory",
  default: "Deposit",
});
