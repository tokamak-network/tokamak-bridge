import { ActionMode } from "@/types/bridgeSwap";
import { SupportedL2ChainId } from "../network/supportedNetwork";

type UniswapTxSort =
  | "Add Liquidity"
  | "Increase Liquidity"
  | "Remove Liquidity"
  | "Swap"
  | "Collect Fee";
type BridgeTxSort = "Deposit" | "Withdraw";
type SwapperTxSort = "Wrap" | "Unwrap";
type ETHWrapTxSort = "ETH-Wrap" | "ETH-Unwrap";
type EtcTxSort = "Approve" | "Revoke";
type UserHistorySort = "Claim";
type CrossTradeTxSort = "Request" | "Provide" | "UpdateFee" | "CancelRequest";

export type TxSort =
  | UniswapTxSort
  | BridgeTxSort
  | SwapperTxSort
  | ETHWrapTxSort
  | EtcTxSort
  | UserHistorySort
  | CrossTradeTxSort;

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
  outNetwork?: number;
  isToasted: boolean;
  actionSort?: ActionSort;
  L2Chain?: SupportedL2ChainId;
}
