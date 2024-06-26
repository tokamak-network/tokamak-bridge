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

export const useFinalize = (params?: WithdrawTransactionHistory) => {
  const { isConnectedToMainNetwork, layer } = useConnectedNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { L1MESSENGER_CONTRACT } = useContract();
  const { setModalOpen } = useTxConfirmModal();
  const { L1Provider, L2Provider } = useProvier();

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
      if (!isConnectedToMainNetwork)
        throw new Error("Not connected to any network");
      if (!L1Provider || !L2Provider) throw new Error("Provider not found");
      if (!params) throw new Error("params not found");

      const { resolved, stateBatchAppended, blockNumber } = params;

      if (!stateBatchAppended) throw new Error("StateBatchAppended not found");

      //close detail modal and open confirming modal
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

      if (layer !== "L1") {
        const chainId = isConnectedToMainNetwork
          ? SupportedChainId.MAINNET
          : SupportedChainId.SEPOLIA;
        const res = await switchNetworkAsync?.(chainId);

        //if user cancel or fail the network switch
        if (!res) return;
      }

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
  }, [L1Provider, L2Provider, isConnectedToMainNetwork, layer, params, write]);

  return { callToFinalize };
};
