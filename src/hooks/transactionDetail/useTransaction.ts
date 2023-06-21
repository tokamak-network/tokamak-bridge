import useContract from "../contracts/useContract";
import { TradeType } from "@uniswap/sdk-core";
import {
  ApproveTransactionInfo,
  ExactInputSwapTransactionInfo,
  WrapTransactionInfo,
  UnwrapTransactionInfo,
  AddLiquidityV3PoolTransactionInfo,
  RemoveLiquidityV3TransactionInfo,
  CollectFeesTransactionInfo,
  CreateV3PoolTransactionInfo,
  DepositLiquidityStakingTransactionInfo,
  WithdrawLiquidityStakingTransactionInfo,
  TransactionType

} from "types/transactions/transactionTypes";

export function useTransaction() {
  const { L1BRIDGE_CONTRACT, L2BRIDGE_CONTRACT, UNISWAP_CONTRACT,SWAPPER_V2_CONTRACT  } =
    useContract();

    // switch ()

}
