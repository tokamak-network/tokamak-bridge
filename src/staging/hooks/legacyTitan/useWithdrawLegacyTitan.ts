import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import L1Bridge_ABI from "@/constant/abis/L1StandardBridge.json";
import useContract from "@/hooks/contracts/useContract";
import { useCallback, useEffect } from "react";
import { useContractWrite, useSwitchNetwork } from "wagmi";
import { useTx } from "@/hooks/tx/useTx";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { useProvier } from "@/hooks/provider/useProvider";
import { getWithdarwCalldata } from "@/utils/history/getWithdrawCalldata";
import { WithdrawTransactionHistory } from "@/staging/types/transaction";
import useDepositWithdrawConfirmModal from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModal";
import useDepositWithdrawConfirm from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModal";
import { ZERO_ADDRESS } from "@/constant/misc";

export const useWithdrawLegacyTitan = (params?: WithdrawTransactionHistory) => {
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { L1BRIDGE_CONTRACT } = useContract();
  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const { L1Provider, L2Provider } = useProvier();
  const { onCloseLegacyTitanConfirmModal } = useDepositWithdrawConfirm();
  const { data, write, isError } = useContractWrite({
    address: L1BRIDGE_CONTRACT,
    abi: L1Bridge_ABI,
    functionName: "forceWithdrawClaim",
  });

  const {} = useTx({ hash: data?.hash, txSort: "LegacyTitanWithdraw" });

  useEffect(() => {
    if (isError) {
      setModalOpen("error");
    }
  }, [isError]);

  const callToWithdrawLegacyTitan = useCallback(async () => {
    try {
      if (isConnectedToMainNetwork === undefined)
        throw new Error("Not connected to any network");
      if (!L1Provider || !L2Provider) throw new Error("Provider not found");
      if (!params) throw new Error("params not found");

      const { forcePosition, legacyTitanHash, outToken } = params;

      //close detail modal and open confirming modal
      onCloseLegacyTitanConfirmModal();
      setIsOpen(true);
      setModalOpen("confirming");
      write({
        args: [
          forcePosition,
          legacyTitanHash,
          outToken.address || ZERO_ADDRESS,
          outToken.amount,
        ],
        gas: BigInt(150000),
      });

      return setModalOpen("confirming");
    } catch (error) {
      console.error("Error in callToFinalize", error);
      setModalOpen("error");
    }
  }, [L1Provider, L2Provider, isConnectedToMainNetwork, params, write]);

  return { callToWithdrawLegacyTitan };
};
