import {
  Network,
  Action,
  Status,
  TransactionToken,
} from "@/staging/types/transaction";
import { createTransaction } from "@/staging/components/new-history/utils/getCreateTransaction";
import useDepositWithdrawConfirmModal from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModal";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useInOutNetwork } from "@/hooks/network";

export const useHandleConfirm = () => {
  const { onOpenDepositWithdrawConfirmModal } =
    useDepositWithdrawConfirmModal();
  const { inToken } = useInOutTokens();
  const { inNetwork, outNetwork } = useInOutNetwork();

  const handleConfirm = (action: Action, status: Status) => {
    const getNetworkEnumValue = (
      chainName: string | undefined
    ): Network | undefined => {
      if (chainName && Object.values(Network).includes(chainName as Network)) {
        return chainName as Network;
      }
      return undefined;
    };

    const inNetworkEnum = getNetworkEnumValue(inNetwork?.chainName);
    const outNetworkEnum = getNetworkEnumValue(outNetwork?.chainName);

    if (inNetworkEnum === undefined || outNetworkEnum === undefined) {
      console.error(
        "Invalid network chain names:",
        inNetwork?.chainName,
        outNetwork?.chainName
      );
      return;
    }

    if (inToken === null || inNetwork === null || outNetwork === null) {
      console.error("Invalid value", inToken, inNetwork, outNetwork);
      return;
    }

    const inTransactionToken: TransactionToken = {
      address: inToken.address[inNetwork?.chainName] as string,
      name: inToken.tokenName as string,
      symbol: inToken.tokenSymbol as string,
      amount: inToken.parsedAmount as string,
      decimals: inToken.decimals,
    };

    const outTransactionToken: TransactionToken = {
      address: inToken.address[outNetwork?.chainName] as string,
      name: inToken.tokenName as string,
      symbol: inToken.tokenSymbol as string,
      amount: inToken.parsedAmount as string,
      decimals: inToken.decimals,
    };

    const transaction = createTransaction(
      action,
      status,
      Network.Mainnet,
      Network.Titan,
      inTransactionToken,
      outTransactionToken
    );

    onOpenDepositWithdrawConfirmModal(transaction);
  };

  return handleConfirm;
};
