import { SupportedTokenSymbol } from "@/types/token/supportedToken";
import { TxInterface } from "@/types/tx/txType";
import { gql } from "@apollo/client";
import { graphQLSelector } from "recoil-relay";

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

export const estimatedGasUsage = atom<number | undefined>({
  key: "estimatedGasUsage",
  default: undefined,
});

export const ethPrice = graphQLSelector({
  key: "ethPrice",
  environment: "dev",
  query: gql`
    query GetTokenMarketData($tokenName: String!) @api(contextKey: "apiName") {
    getTokenMarketData(tokenName: $tokenName) {
      current_price
    }
  }`,
  variables: ({ get }) => ({ tokenName: "ethereum", apiName: "price" }),
  mapResponse: (data) => data.getTokenMarketData?.current_price,
});

export const estimatedGasFee = selector<number | undefined>({
  key: "estimatedGasFee",
  get: async ({ get }) => {
    const searchedToken = get(estimatedGasUsage);
    // const ethMarketPrice = get(ethPrice);

    if (searchedToken) {
      return undefined;
    }
    return undefined;
  },
});

type TransactionData = any;

export const transactionData = atom<TransactionData>({
  key: "transactionData",
  default: [],
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

export const txPendingStatus = atom<boolean>({
  key: "txPendingStatus",
  default: false,
});

export const txHashStatus = atom<string | undefined>({
  key: "txHashStatus",
  default: undefined,
});
