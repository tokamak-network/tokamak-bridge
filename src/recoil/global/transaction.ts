import { SupportedTokenSymbol } from "@/types/token/supportedToken";
import { TxInterface } from "@/types/tx/txType";

export enum TransactionState {
  Failed = "Failed",
  New = "New",
  Rejected = "Rejected",
  Sending = "Sending",
  Sent = "Sent",
}

export type T_BridgeTransactionDetail = {
  inputToken: SupportedTokenSymbol;
  inputAmount: string;
  gasFee: {
    l1Gas: { eth: string; ton: string } | null;
    l2Gas: { eth: string; ton: string } | null;
  };
};

export type T_SwapTransactionDetail = {
  inputToken: SupportedTokenSymbol | string;
  inputAmount: string;
  outToken: SupportedTokenSymbol | string;
  outAmount: string;
  expectedAmount: string;
  minimumReceived: string;
  slippage: string;
  gasFee: string;
};

import { atom, selector } from "recoil";

type GasDataAtom = {
  l1GasPrice: BigInt | null;
  l2GasPrice: BigInt | null;
  l1EstimatedGasUsage: BigInt | null;
  l2EstimatedGasUsage: BigInt | null;
  l1GasTotal: BigInt | null;
  l2GasTotal: BigInt | null;
};

export const gasData = atom<GasDataAtom>({
  key: "gasData",
  default: {
    l1GasPrice: null,
    l2GasPrice: null,
    l1EstimatedGasUsage: null,
    l2EstimatedGasUsage: null,
    l1GasTotal: null,
    l2GasTotal: null,
  },
});

export const swapGasData = atom<{ estimatedGasFee: string | undefined }>({
  key: "swapGasData",
  default: {
    estimatedGasFee: undefined,
  },
});

type TransactionData = {
  data: any[];
};

export const transactionData = atom<TransactionData>({
  key: "transactionData",
  default: {
    data: [],
  },
});

export const txDataStatus = atom<{ [txHash: string]: TxInterface } | undefined>(
  {
    key: "txDataStatus",
    default: undefined,
  }
);

export const txDataSelector = selector({
  key: "txDataSelector",
  get: async ({ get }) => {
    const txData = get(txDataStatus);
  },
});
