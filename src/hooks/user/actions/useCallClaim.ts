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
import { useAccount } from "wagmi";
import useCrosschainMessenger from "../useCrosschainMessenger";
import { useCallback, useEffect, useState } from "react";

export default function useCallClaim() {
  const { connectedChainId, isConnectedToMainNetwork, layer } =
    useConnectedNetwork();
  const [network, setNetwork] = useRecoilState(networkStatus);
  const {
    switchNetworkAsync,
    isError,
    switchNetwork,
    chains,
    error,
    isLoading,
    pendingChainId,
  } = useSwitchNetwork();
  const { L1MESSENGER_CONTRACT } = useContract();
  const { address } = useAccount();
  const { crossMessenger } = useCrosschainMessenger();
  const [isConnectedToL1, setIsConnectedToL1] = useState(false);

  useEffect(() => {
    const isCnnctdToL1 =
      connectedChainId === SupportedChainId["MAINNET"] ||
      connectedChainId === SupportedChainId["GOERLI"];

      console.log('isCnnctdToL1',isCnnctdToL1);
      
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

  const claim = useCallback(
    async (tx: any) => {
      console.log('ggg1',connectedChainId);
     
      changeNetwork();
  
    

        if (isConnectedToL1) {
          const provider = getL1Provider();
          console.log('ggg2',connectedChainId);
          try {
            const messengerContract = new ethers.Contract(
              L1MESSENGER_CONTRACT,
              L1CrossDomainMessenger_ABI,
              provider
            );

            const proof = await crossMessenger.getMessageProof(tx.resolved);

            const transaction =
              await messengerContract.populateTransaction.relayMessage(
                tx.resolved.target,
                tx.resolved.sender,
                tx.resolved.message,
                tx.resolved.messageNonce,
                proof
              );

            return sendTransaction({
              ...transaction,
              from: address,
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
