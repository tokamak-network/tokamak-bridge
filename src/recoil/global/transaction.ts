import { SupportedTokenName } from "@/types/token/supportedToken";

export enum TransactionState {
  Failed = "Failed",
  New = "New",
  Rejected = "Rejected",
  Sending = "Sending",
  Sent = "Sent",
}

export type T_BridgeTransactionDetail = {
  inputToken: SupportedTokenName;
  inputAmount: string;
  gasFee: {
    l1Gas: { eth: string; ton: string } | null;
    l2Gas: { eth: string; ton: string } | null;
  };
};

export type T_SwapTransactionDetail = {
  inputToken: SupportedTokenName | string;
  inputAmount: string;
  outToken: SupportedTokenName | string;
  outAmount: string;
  expectedAmount: string;
  minimumReceived: string;
  slippage: string;
  gasFee: string;
};
