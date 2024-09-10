import {
  Action,
  CT_Status,
  Status,
  TransactionHistory,
} from "@/staging/types/transaction";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getCurrentProgressStatus } from "../../new-history-thanos/utils/historyStatus";
import { isThanosChain, isTitanChain } from "@/utils/network/checkNetwork";

export const getBridgeActionButtonContent = (tx: TransactionHistory) => {
  const { action, status, inNetwork, outNetwork } = tx;
  if (status === Status.Initiate) return "Initiate";
  if (status === Status.Initiated && action === Action.Deposit) return null;
  if (status === Status.Initiated || status === Status.Prove) return "Prove";
  if (status === Status.Rollup) return "Rollup";
  if (status === Status.Proved || status === Status.Finalize) return "Finalize";
  return null;
};

export const isActionDisabled = (status: Status | CT_Status) => {
  return status === Status.Initiated || status === Status.Proved;
};

export const getBridgeL2ChainId = (tx?: TransactionHistory | null) => {
  if (!tx) return null;
  return tx.action === Action.Deposit ? tx.outNetwork : tx.inNetwork;
};

export const getBridgeL1ChainId = (tx?: TransactionHistory) => {
  if (!tx) return null;
  return tx.action === Action.Deposit ? tx.inNetwork : tx.outNetwork;
};

export const getLineConfig = (tx: TransactionHistory) => {
  const pointCount =
    tx.action === Action.Deposit ? 2 : tx.action === Action.Withdraw ? 3 : 0;
  let currentIndex = 0;
  let completedIndex = 0;
  switch (tx.status) {
    case Status.Initiate:
      break;
    case Status.Initiated:
      currentIndex = 1;
      break;
    case Status.Rollup:
      completedIndex = 1;
      currentIndex = 1;
      break;
    case Status.Prove:
      completedIndex = 1;
      currentIndex = 1;
      break;
    case Status.Proved:
      completedIndex = 1;
      currentIndex = 2;
    case Status.Finalize:
      completedIndex = 2;
      currentIndex = 2;
  }
  return { pointCount, currentIndex, completedIndex };
};

export const getNextStatus = (label: Status | CT_Status) => {
  switch (label) {
    case Status.Initiate:
      return Status.Initiated;
    case Status.Prove:
      return Status.Proved;
    case Status.Finalize:
      return Status.Completed;
    default:
      return Status.Completed;
  }
};

export const getDepositWithdrawWaitMessage = (
  status: Status,
  action: Action,
  L2ChainId: SupportedChainId | null
) => {
  if (action === Action.Withdraw) {
    switch (status) {
      case Status.Initiate:
        return isThanosChain(L2ChainId)
          ? "Wait 1~6 hours"
          : isTitanChain(L2ChainId)
          ? "Wait 1 hour"
          : "";
      case Status.Prove:
        return "Wait 7 days";
      case Status.Rollup:
        return "Wait 7 days";
      default:
        return "";
    }
  }
  return "";
};
