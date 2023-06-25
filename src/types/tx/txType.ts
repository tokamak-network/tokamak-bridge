import { TransactionState } from "@/recoil/global/transaction";
import { SupportedChainId } from "../network/supportedNetwork";

type UniswapTxSort =
  | "Add Liquidity"
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
  txHash: `0x${string}` | undefined;
  txSort: TxSort;
  transactionState: "success" | "fail";
  tokenData: TokenTxData[];
  network: number;
}
