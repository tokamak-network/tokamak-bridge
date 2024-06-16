import { Network, Action, Status } from "@/components/historyn/types";
import { createTransaction } from "@/components/historyn/utils/getCreateTransaction";
import useDepositWithdrawConfirmModal from "@/components/confirmn/hooks/useDepositWithdrawConfirmModal";
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

    const transaction = createTransaction(
      action,
      status,
      inNetworkEnum,
      outNetworkEnum,
      inToken?.tokenSymbol as string,
      inToken?.parsedAmount as string
    );

    onOpenDepositWithdrawConfirmModal(transaction);
  };

  return handleConfirm;
};
