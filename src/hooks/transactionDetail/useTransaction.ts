import useContract from "../contracts/useContract";
import { TradeType } from "@uniswap/sdk-core";
import { useMemo } from "react";
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
  TransactionType,
} from "types/transactions/transactionTypes";
import { TransactionInfo } from "@/types/transactions/transactionTypes";
import { useRecoilState } from "recoil";
import { transactionData } from "@/recoil/global/transaction";
import { Flex } from "@chakra-ui/react";
export function useTransaction() {
  const {
    L1BRIDGE_CONTRACT,
    L2BRIDGE_CONTRACT,
    UNISWAP_CONTRACT,
    SWAPPER_V2_CONTRACT,
  } = useContract();
  const [t, setTransactionData] = useRecoilState(transactionData);

  const txDetails = useMemo(() => {
    switch (t.info?.type) {
      case TransactionType.APPROVAL:
        return; //
      case TransactionType.WRAP:
        return; //
      case TransactionType.UNWRAP:
        return; //
      case TransactionType.WITHDRAW:
        return;
      case TransactionType.DEPOSIT:
        return; //
      case TransactionType.SWAP:
        return; //
      case TransactionType.ADD_LIQUIDITY:
        return;
      case TransactionType.REMOVE_LIQUIDITY:
        return;
      case TransactionType.COLLECT_FEES:
        return;
      case TransactionType.MINT:
        return;
      default:
        return; //
    }
  }, []);
}
