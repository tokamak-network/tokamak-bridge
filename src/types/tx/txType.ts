type UniswapTxSort =
  | "Add Liquidity"
  | "Increase Liquidity"
  | "Remove Liquidity"
  | "Swap"
  | "Collect Fee";
type BridgeTxSort = "Deposit" | "Withdraw";
type SwapperTxSort = "Wrap" | "Unwrap";
type EtcTxSort = "Approve";

export type TxSort = UniswapTxSort | BridgeTxSort | SwapperTxSort | EtcTxSort;
export type TokenTxData = {
  tokenAddress: string;
  amount: BigInt;
};

export interface TxInterface {
  transactionHash: `0x${string}` | undefined;
  txSort: TxSort;
  transactionState: "success" | "fail" | undefined;
  tokenData: TokenTxData[] | undefined;
  network: number;
  isToasted: boolean;
}
