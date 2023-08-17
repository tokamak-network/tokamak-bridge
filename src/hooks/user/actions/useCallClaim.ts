import useConnectedNetwork from "@/hooks/network";
import {
  SupportedChainId,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { useRecoilState } from "recoil";
import { networkStatus } from "@/recoil/bridgeSwap/atom";
import { useSwitchNetwork } from "wagmi";
import L1CrossDomainMessenger_ABI from "constant/abis/L1CrossDomainMessenger.json";
import useContract from "@/hooks/contracts/useContract";
import { getL1Provider } from "@/config/l1Provider";
import { ethers } from "ethers";
import {
  getWalletAddress,
  sendTransaction,
  TransactionState,
} from "utils/uniswap/libs/provider";
import useCrosschainMessenger from "../useCrosschainMessenger";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useContractWrite, useSendTransaction } from "wagmi";
import { useTx } from "@/hooks/tx/useTx";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";

export default function useCallClaim(functionName: string) {

  console.log(functionName);
  
  const { connectedChainId, isConnectedToMainNetwork, layer } =
    useConnectedNetwork();
  const [network, setNetwork] = useRecoilState(networkStatus);
  const { switchNetworkAsync, switchNetwork } = useSwitchNetwork();
  const { L1MESSENGER_CONTRACT } = useContract();
  const { address } = useAccount();
  const { crossMessenger } = useCrosschainMessenger();
  const [isConnectedToL1, setIsConnectedToL1] = useState(false);
  const { data, write, isError } = useContractWrite({
    address: L1MESSENGER_CONTRACT,
    abi: L1CrossDomainMessenger_ABI,
    functionName,
  });
  const { setModalOpen, setIsOpen } = useTxConfirmModal();

  // const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction()
  useEffect(() => {
    const isCnnctdToL1 =
      connectedChainId === SupportedChainId["MAINNET"] ||
      connectedChainId === SupportedChainId["GOERLI"];
    setIsConnectedToL1(isCnnctdToL1);
  }, [connectedChainId]);

  const changeNetwork = async () => {
    if (!isConnectedToL1) {
      const selectedWork = supportedChain.filter((supportedChain) => {
        if (isConnectedToMainNetwork === true) {
          return [SupportedChainId["MAINNET"]].includes(supportedChain.chainId);
        } else {
          return [SupportedChainId["GOERLI"]].includes(supportedChain.chainId);
        }
      })[0];
      switchNetwork?.(selectedWork.chainId);
    }
  };

  const {} = useTx({ hash: data?.hash, txSort: "Claim" });


  const claim = useCallback(
    async (tx: any) => {
      console.log("ggg1", connectedChainId);

      changeNetwork();

      if (isConnectedToL1) {
        const provider = getL1Provider();
        try {
          const messengerContract = new ethers.Contract(
            L1MESSENGER_CONTRACT,
            L1CrossDomainMessenger_ABI,
            provider
          );

          const proof = await crossMessenger.getMessageProof(tx.resolved);

          // const transaction =
          //   await messengerContract.populateTransaction.relayMessage(
          //     tx.resolved.target,
          //     tx.resolved.sender,
          //     tx.resolved.message,
          //     tx.resolved.messageNonce,
          //     proof
          //   );

          //   console.log('transaction',transaction);

          // const xx = await sendTransaction({
          //   ...transaction,
          //   from: address,
          // });

          // console.log('xx',xx);
          setIsOpen(true);
          setModalOpen("confirming");
          return write({
            args: [
              tx.resolved.target,
              tx.resolved.sender,
              tx.resolved.message,
              tx.resolved.messageNonce,
              proof,
            ],
          });
        } catch (e) {
          console.log(e);
        }
      }

      //     const eventSendMessage = await crossChainMessenger.toCrossChainMessage(tx.l2txHash)
      // console.log(`eventSendMessage : `, eventSendMessage)
      // const currentStatus = await crossChainMessenger.getMessageStatus(eventSendMessage)
      // console.log(`currentStatus : `, currentStatus)
      //     const finalize = await crossChainMessenger.finalizeMessage(
      //       tx.l2TxReceipt
      //     );
      //     console.log("finalize", finalize);
    },
    [isConnectedToL1]
  );

  return { claim };
}
