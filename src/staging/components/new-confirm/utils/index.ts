import {
  Action,
  CT_Status,
  DepositWithdrawType,
  Status,
  TransactionHistory,
} from "@/staging/types/transaction";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getCurrentProgressStatus } from "../../new-history-thanos/utils/historyStatus";
import { isThanosChain, isTitanChain } from "@/utils/network/checkNetwork";
import { GasEstimateConstantType, TransactionFeeType } from "../types";
import { SupportedTokenSymbol } from "@/types/token/supportedToken";

export const getBridgeActionButtonContent = (tx: TransactionHistory) => {
  const { action, status } = tx;
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
      break;
    case Status.Finalize:
      completedIndex = 2;
      currentIndex = 2;
      break;
    case Status.Completed:
      completedIndex = 2;
      currentIndex = 2;
      break;
    default:
      break;
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
        return L2ChainId === SupportedChainId.THANOS_SEPOLIA
          ? "Wait 12 seconds"
          : "Wait 7 days";
      case Status.Rollup:
        return "Wait 7 days";
      default:
        return "";
    }
  }
  return "";
};

export const getEstimatedWithdrawalFeeConstant = (
  chainId: SupportedChainId | null,
  type: DepositWithdrawType
): Partial<Record<Status, TransactionFeeType>> | null => {
  if (chainId === SupportedChainId.THANOS_SEPOLIA) {
    switch (type) {
      case DepositWithdrawType.ETH:
        return {
          Initiate: { amount: 0.001, tokenSymbol: "TON" },
          Prove: { amount: 0.02 },
          Finalize: { amount: 0.02 },
        };
      case DepositWithdrawType.ERC20:
        return {
          Initiate: { amount: 0.0001, tokenSymbol: "TON" },
          Prove: { amount: 0.01 },
          Finalize: { amount: 0.01 },
        };
      case DepositWithdrawType.NativeToken:
        return {
          Initiate: { amount: 0.0003, tokenSymbol: "TON" },
          Prove: { amount: 0.01 },
          Finalize: { amount: 0.01 },
        };
      default:
        return {
          Initiate: { amount: 0.001, tokenSymbol: "TON" },
          Prove: { amount: 0.01 },
          Finalize: { amount: 0.01 },
        };
    }
  }
  return null;
};

export const getDepositWithdrawType = (tokenSymbol: string) => {
  if (tokenSymbol === "ETH") return DepositWithdrawType.ETH;
  if (tokenSymbol === "TON") return DepositWithdrawType.NativeToken;
  return DepositWithdrawType.ERC20;
};

export const getNativeToken = (chainId: SupportedChainId | null) => {
  if (isThanosChain(chainId)) return "TON";
  else return "ETH";
};
