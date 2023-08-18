import useConnectedNetwork from "@/hooks/network";
import {
  SupportedChainId,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { useRecoilState, useRecoilValue } from "recoil";
import { networkStatus } from "@/recoil/bridgeSwap/atom";
import { useSwitchNetwork } from "wagmi";
import L1CrossDomainMessenger_ABI from "constant/abis/L1CrossDomainMessenger.json";
import useContract from "@/hooks/contracts/useContract";
import { getL1Provider } from "@/config/l1Provider";
import { ethers } from "ethers";
import { confirmWithdraw } from "@/recoil/modal/atom";
import useCrosschainMessenger from "../useCrosschainMessenger";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useContractWrite, useSendTransaction } from "wagmi";
import { useTx } from "@/hooks/tx/useTx";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { claimTx } from "@/recoil/userHistory/claimTx";

export default function useCallClaim(functionName: string) {
  const { connectedChainId, isConnectedToMainNetwork, layer } =
    useConnectedNetwork();
  const [network, setNetwork] = useRecoilState(networkStatus);
  const { switchNetworkAsync, switchNetwork } = useSwitchNetwork();
  const { L1MESSENGER_CONTRACT } = useContract();
  const { address } = useAccount();
  const { crossMessenger } = useCrosschainMessenger();
  const [isConnectedToL1, setIsConnectedToL1] = useState(false);
  const [withdraw, setWithdraw] = useRecoilState(confirmWithdraw);

  const { data, write, isError } = useContractWrite({
    address: L1MESSENGER_CONTRACT,
    abi: L1CrossDomainMessenger_ABI,
    functionName,
  });

  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const claimTxArgs = useRecoilValue(claimTx);
  // const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction()
  useEffect(() => {
    const isCnnctdToL1 =
      connectedChainId === SupportedChainId["MAINNET"] ||
      connectedChainId === SupportedChainId["GOERLI"];
    setIsConnectedToL1(isCnnctdToL1);
  }, [connectedChainId]);

  const changeNetwork = async () => {
    if (!isConnectedToL1) {
      console.log("cmae here too");

      const selectedWork = supportedChain.filter((supportedChain) => {
        if (isConnectedToMainNetwork === true) {
          return [SupportedChainId["MAINNET"]].includes(supportedChain.chainId);
        } else {
          return [SupportedChainId["GOERLI"]].includes(supportedChain.chainId);
        }
      })[0];
      const xx = await switchNetworkAsync?.(selectedWork.chainId);
      return xx;
    }

    else {
      return {
        
        id: connectedChainId
       
      }
      
    }
  };
  console.log("data", data);

  const {} = useTx({ hash: data?.hash, txSort: "Claim" });
  useEffect(() => {
    if (isError) {
      setModalOpen("error");
    }
  }, [isError]);

  const claim = useCallback(
    async (tx: any) => {
      console.log("came here ");

      const connectedNetwork = await changeNetwork();

      if (
        (connectedNetwork?.id === 5 || connectedNetwork?.id === 1) &&
        claimTxArgs !== undefined
      ) {

        console.log('here too');
        
        const provider = getL1Provider();
        // try {
        //   const messengerContract = new ethers.Contract(
        //     L1MESSENGER_CONTRACT,
        //     L1CrossDomainMessenger_ABI,
        //     provider
        //   );

        //   const proof = await crossMessenger.getMessageProof(
        //     claimTxArgs.resolved
        //   );

        //   console.log('proof',proof);
          

        //   setIsOpen(true);
        //   setModalOpen("confirming");
        //   setWithdraw({
        //     isOpen: false,
        //     modalData: null,
        //   });
        //   return write({
        //     args: [
        //       claimTxArgs.resolved.target,
        //       claimTxArgs.resolved.sender,
        //       claimTxArgs.resolved.message,
        //       claimTxArgs.resolved.messageNonce,
        //       proof,
        //     ],
        //   });
        // } catch (e) {
        //   console.log(e);
        // }
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
