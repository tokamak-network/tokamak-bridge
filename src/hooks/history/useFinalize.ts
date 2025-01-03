import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import L1CrossDomainMessenger_ABI from "constant/abis/L1CrossDomainMessenger.json";
import useContract from "@/hooks/contracts/useContract";
import { useCallback, useEffect } from "react";
import { useContractWrite, useSwitchNetwork } from "wagmi";
import { useTx } from "@/hooks/tx/useTx";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { useProvier } from "@/hooks/provider/useProvider";
import { getWithdarwCalldata } from "@/utils/history/getWithdrawCalldata";
import { WithdrawTransactionHistory } from "@/staging/types/transaction";
import useDepositWithdrawConfirmModal from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModal";

export const useFinalize = (params?: WithdrawTransactionHistory) => {
  const { isConnectedToMainNetwork, isLayer2 } = useConnectedNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { L1MESSENGER_CONTRACT } = useContract();
  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const { L1Provider, L2Provider } = useProvier();
  const { onCloseDepositWithdrawConfirmModal } =
    useDepositWithdrawConfirmModal();
  const { data, write, isError } = useContractWrite({
    address: L1MESSENGER_CONTRACT,
    abi: L1CrossDomainMessenger_ABI,
    functionName: "relayMessage",
  });

  const {} = useTx({ hash: data?.hash, txSort: "Claim" });

  useEffect(() => {
    if (isError) {
      setModalOpen("error");
    }
  }, [isError]);

  const callToFinalize = useCallback(async () => {
    try {
      if (isConnectedToMainNetwork === undefined)
        throw new Error("Not connected to any network");
      if (!L1Provider || !L2Provider) throw new Error("Provider not found");
      if (!params) throw new Error("params not found");
      if (params)
        if (isLayer2) {
          const chainId = isConnectedToMainNetwork
            ? SupportedChainId.MAINNET
            : SupportedChainId.SEPOLIA;
          const res = await switchNetworkAsync?.(chainId);

          //if user cancel or fail the network switch
          if (!res) return;
        }

      const { resolved, stateBatchAppended, blockNumber } = params;

      if (!stateBatchAppended) throw new Error("StateBatchAppended not found");
      onCloseDepositWithdrawConfirmModal();
      //close detail modal and open confirming modal
      setIsOpen(true);
      setModalOpen("confirming");

      const proof = await getWithdarwCalldata({
        hash: stateBatchAppended.transactionHash,
        provider: L1Provider,
        l2Provider: L2Provider,
        stateBatchAppendedEvent: stateBatchAppended,
        sentMessageEvent: {
          ...resolved,
          blockNumber: blockNumber,
        },
        l2BlcokNumber: blockNumber,
        isConnectedToMainNetwork,
      });

      write({
        args: [
          resolved.target,
          resolved.sender,
          resolved.message,
          resolved.messageNonce,
          proof,
        ],
      });

      return setModalOpen("confirming");
    } catch (error) {
      console.error("Error in callToFinalize", error);
      setModalOpen("error");
    }
  }, [
    L1Provider,
    L2Provider,
    isConnectedToMainNetwork,
    isLayer2,
    params,
    write,
  ]);

  return { callToFinalize };
};
