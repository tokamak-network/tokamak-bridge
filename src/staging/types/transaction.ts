import { Resolved } from "@/types/activity/history";
import { StateBatchAppended } from "@/utils/history/getCurrentStatus";
import { SupportedChainId } from "@/types/network/supportedNetwork";

export enum HISTORY_SORT {
  STANDARD,
  CROSS_TRADE,
}

export enum Action {
  Withdraw = "Withdraw",
  Deposit = "Deposit",
}

export enum CT_ACTION {
  REQUEST,
  PROVIDE,
}

export enum Status {
  Initiate = "Initiate",
  Rollup = "Rollup",
  Prove = "Prove",
  Finalize = "Finalize",
  Completed = "Completed",
}

export enum CT_REQUEST {
  Request = "CT_REQ_REQUEST",
  UpdateFee = "CT_REQ_UPDATE_FEE",
  WaitForReceive = "CT_REQ_WAIT_FOR_RECEIVE",
  Completed = "CT_REQ_COMPLETED",
}
export enum CT_REQUEST_CANCEL {
  Request = "CT_REQ_REQUEST",
  CancelRequest = "CT_REQ_CANCEL_REQUEST",
  Refund = "CT_REQ_REFUND",
  Completed = "CT_REQ_CANCEL_COMPLETED",
}
export enum CT_PROVIDE {
  Provide = "CT_PRO_PROVIDE",
  Return = "CT_PRO_RETURN",
  Completed = "CT_PRO_COMPLETED",
}

export type CT_Status = CT_REQUEST | CT_REQUEST_CANCEL | CT_PROVIDE;
export type HISTORY_TRANSACTION_STATUS = Status | CT_Status;
export interface TransactionToken {
  address: string;
  name: string;
  symbol: string;
  amount: string;
  decimals: number;
}

export enum ERROR_CODE {
  ROLLUP_NOT_COMPLETED,
  CT_REFUND_NOT_COMPLETED,
  CT_LIQUIDITY_NOT_RETURNED,
}

export interface I_TransactionHistory {
  category: HISTORY_SORT;
  inNetwork: SupportedChainId;
  outNetwork: SupportedChainId;
  inToken: TransactionToken;
  outToken: TransactionToken;
  errorMessage?: ERROR_CODE;
}

export interface BaseTransactionHistory extends I_TransactionHistory {
  action: Action;
  status: Status;
}
export interface BaseCTTransactionHistory extends I_TransactionHistory {
  action: CT_ACTION;
  status: CT_Status;
}
export interface WithdrawTransactionHistory extends BaseTransactionHistory {
  action: Action.Withdraw;
  status: Status;
  blockTimestamps: {
    initialCompletedTimestamp: number;
    rollupCompletedTimestamp?: number;
    finalizedCompletedTimestamp?: number;
  };
  transactionHashes: {
    initialTransactionHash: string;
    rollupTransactionHash?: string;
    finalizedTransactionHash?: string;
  };
  resolved: Resolved;
  stateBatchAppended?: StateBatchAppended;
  blockNumber: number;
}

export interface DepositTransactionHistory extends BaseTransactionHistory {
  action: Action.Deposit;
  blockTimestamps: {
    initialCompletedTimestamp: number;
    finalizedCompletedTimestamp?: number;
  };
  transactionHashes: {
    initialTransactionHash: string;
    finalizedTransactionHash?: string;
  };
}

export interface CT_Request_History extends BaseCTTransactionHistory {
  action: CT_ACTION.REQUEST;
  isCanceled: boolean;
  blockTimestamps: {
    request: number;
    updateFee?: number[];
    waitForReceive?: number;
    cancelRequest?: number;
    refund?: number;
  };
  transactionHashes: {
    request: string;
    updateFee?: string[];
    waitForReceive?: string;
    cancelRequest?: string;
    refund?: string;
  };
}
export interface CT_Provide_History extends BaseCTTransactionHistory {
  action: CT_ACTION.PROVIDE;
  blockTimestamps: {
    provide: number;
    return?: number;
  };
  transactionHashes: {
    provide: string;
    return?: string;
  };
}

export type StandardHistory =
  | WithdrawTransactionHistory
  | DepositTransactionHistory;
export type CT_History = CT_Request_History | CT_Provide_History;

export type TransactionHistory = StandardHistory | CT_History;

export function isWithdrawTransactionHistory(
  transaction: TransactionHistory
): transaction is WithdrawTransactionHistory {
  return (
    transaction.action === Action.Withdraw &&
    "transactionHashes" in transaction &&
    "initialTransactionHash" in transaction.transactionHashes &&
    "blockTimestamps" in transaction &&
    "initialCompletedTimestamp" in transaction.blockTimestamps
  );
}

export function isDepositTransactionHistory(
  transaction: TransactionHistory
): transaction is DepositTransactionHistory {
  return (
    transaction.action === Action.Deposit &&
    "transactionHashes" in transaction &&
    "initialTransactionHash" in transaction.transactionHashes &&
    "blockTimestamps" in transaction &&
    "initialCompletedTimestamp" in transaction.blockTimestamps
  );
}

export function isInCT_REQUEST(value: HISTORY_TRANSACTION_STATUS): boolean {
  return Object.values(CT_REQUEST).includes(value as CT_REQUEST);
}

export function isInCT_REQUEST_CANCEL(
  value: HISTORY_TRANSACTION_STATUS
): boolean {
  return Object.values(CT_REQUEST_CANCEL).includes(value as CT_REQUEST_CANCEL);
}

export function isInCT_Provide(value: HISTORY_TRANSACTION_STATUS): boolean {
  return Object.values(CT_PROVIDE).includes(value as CT_PROVIDE);
}

export function getCancelValueFromCTRequestHistory(
  object: any
): object is CT_Request_History {
  return (object as CT_Request_History).isCanceled;
}

export function ableToUpdateFee(transaction: any): boolean {
  return (
    transaction.status === CT_REQUEST.Request ||
    transaction.status === CT_REQUEST.UpdateFee ||
    transaction.status === CT_REQUEST.WaitForReceive
  );
}
export interface GasCostData {
  withdrawInitiateGasCostText?: string;
  withdrawInitiateGasCostUS?: string;
  withdrawClaimGasCostText?: string;
  withdrawClaimGasCostUS?: string;
  depositInitiateGasCostText?: string;
  depositGasCostUS?: string;
}
