import { CTTransactionType } from "@/types/crossTrade/contracts";

type CrossTradeGasFee = { [key in CTTransactionType]: number };

const crossTradeGasFee: CrossTradeGasFee = {
  [CTTransactionType.provideCT]: 225000,
  [CTTransactionType.requestRegisteredToken]: 237514,
  [CTTransactionType.editFee]: 69243,
  [CTTransactionType.cancel]: 198013,
  [CTTransactionType.strandardWithdrawERC20]: 600000,
};

export const recommendFeeConfig = {
  gas: crossTradeGasFee,
  fee: {
    //percentage of the total amount
    TON: 1.09041,
    TOS: 1.09041,
    USDC: 0.53425,
    USDT: 0.53425,
    ETH: 0.47671,
  },
} as {
  gas: CrossTradeGasFee;
  fee: {
    [key: string]: number;
  };
};
