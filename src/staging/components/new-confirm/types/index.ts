export type GasEstimateConstantType = {
  Initiate: number;
  Prove: number;
  Finalize: number;
};

export interface TransactionFeeType {
  amount: number;
  tokenSymbol?: string;
}
