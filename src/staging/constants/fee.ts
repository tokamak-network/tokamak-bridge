import { CTTransactionType } from "@/types/crossTrade/contracts";

type CrossTradeGasFee = { [key in CTTransactionType]: number };

const crossTradeGasFee: CrossTradeGasFee = {
  [CTTransactionType.provideCT]: 245000,
  [CTTransactionType.requestRegisteredToken]: 237514,
  [CTTransactionType.editFee]: 69243,
  [CTTransactionType.cancel]: 198013,
  [CTTransactionType.strandardWithdrawERC20]: 600000,
};

export const recommendFeeConfig = {
  gas: crossTradeGasFee,
  fee: {
    //percentage of the total amount
    TON: 4.565753,
    USDC: 1.385342,
    USDT: 1.385342,
    ETH: 1.578767,
  },
} as {
  gas: CrossTradeGasFee;
  fee: {
    [key: string]: number;
  };
};
