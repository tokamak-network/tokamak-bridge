import { ActionMode } from "@/types/bridgeSwap";

type UniswapTxSort =
  | "Add Liquidity"
  | "Increase Liquidity"
  | "Remove Liquidity"
  | "Swap"
  | "Collect Fee";
type BridgeTxSort = "Deposit" | "Withdraw";
type SwapperTxSort = "Wrap" | "Unwrap";
type ETHWrapTxSort = "ETH-Wrap" | "ETH-Unwrap";
type EtcTxSort = "Approve";
type UserHistorySort = "Claim";

export type TxSort =
  | UniswapTxSort
  | BridgeTxSort
  | SwapperTxSort
  | ETHWrapTxSort
  | EtcTxSort
  | UserHistorySort;

export type ActionSort = ActionMode;

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
  actionSort?: ActionSort;
}
