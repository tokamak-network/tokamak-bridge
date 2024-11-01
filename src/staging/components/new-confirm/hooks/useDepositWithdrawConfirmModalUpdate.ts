import { depositWithdrawConfirmModalStatus } from "@/recoil/modal/atom";
import {
  isDepositTransactionHistory,
  isWithdrawTransactionHistory,
  StandardHistory,
  TransactionHistory,
} from "@/staging/types/transaction";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export default function useDepositWithdrawConfirmModalUpdate(
  transactionData: TransactionHistory
) {
  const [depositWithdrawConfirmModal, setDepositWithdrawConfirmModal] =
    useRecoilState(depositWithdrawConfirmModalStatus);
  useEffect(() => {
    if (
      isDepositTransactionHistory(transactionData) ||
      isWithdrawTransactionHistory(transactionData)
    ) {
      if (
        transactionData.transactionHashes.initialTransactionHash ===
        depositWithdrawConfirmModal.transaction?.transactionHashes
          ?.initialTransactionHash
      ) {
        setDepositWithdrawConfirmModal((prev) => ({
          ...prev,
          transaction: transactionData,
        }));
      }
    }
  }, [transactionData]);
  return {};
}
