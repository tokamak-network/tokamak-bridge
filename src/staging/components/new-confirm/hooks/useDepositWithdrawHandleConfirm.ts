import { Action, Status, TransactionToken } from "@/staging/types/transaction";
import { createTransaction } from "@/staging/components/new-history/utils/getCreateTransaction";
import useDepositWithdrawConfirmModal from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModal";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useInOutNetwork } from "@/hooks/network";

export const useHandleConfirm = () => {
  const { onOpenLegacyTitanConfirmModal } = useDepositWithdrawConfirmModal();
  const { inToken } = useInOutTokens();
  const { inNetwork, outNetwork } = useInOutNetwork();

  const handleConfirm = (action: Action, status: Status) => {
    if (inToken === null || inNetwork === null || outNetwork === null) {
      console.error("Invalid value", inToken, inNetwork, outNetwork);
      return;
    }

    const inTransactionToken: TransactionToken = {
      address: inToken.address[inNetwork?.chainName] as string,
      name: inToken.tokenName as string,
      symbol: inToken.tokenSymbol as string,
      amount: String(inToken.amountBN) as string,
      decimals: inToken.decimals,
    };

    const outTransactionToken: TransactionToken = {
      address: inToken.address[outNetwork?.chainName] as string,
      name: inToken.tokenName as string,
      symbol: inToken.tokenSymbol as string,
      amount: String(inToken.amountBN) as string,
      decimals: inToken.decimals,
    };

    const transaction = createTransaction(
      action,
      status,
      inNetwork.chainId,
      outNetwork.chainId,
      inTransactionToken,
      outTransactionToken,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      inToken.forcePosition ?? "",
      inToken.legacyTitanHash ?? ""
    );
    onOpenLegacyTitanConfirmModal(transaction);
  };

  return handleConfirm;
};
