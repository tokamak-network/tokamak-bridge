import {
  Action,
  TransactionHistory,
} from "@/staging/types/transaction";
export const getBridgeL2ChainId = (tx?: TransactionHistory | null) => {
  if (!tx) return null;
  return tx.action === Action.Deposit ? tx.outNetwork : tx.inNetwork;
};

export const getBridgeL1ChainId = (tx?: TransactionHistory) => {
  if (!tx) return null;
  return tx.action === Action.Deposit ? tx.inNetwork : tx.outNetwork;
};