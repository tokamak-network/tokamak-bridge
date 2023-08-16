import useConnectedNetwork from "@/hooks/network";
import {
  SupportedChainId,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { useRecoilState } from "recoil";
import { networkStatus } from "@/recoil/bridgeSwap/atom";
import { useSwitchNetwork } from "wagmi";
import useGetTransaction from "../useGetTransaction";
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

export default function useCallClaim() {
  const { connectedChainId, isConnectedToMainNetwork, layer } =
    useConnectedNetwork();
  const [network, setNetwork] = useRecoilState(networkStatus);
  const { switchNetworkAsync, isError, switchNetwork } = useSwitchNetwork();
  const tData = useGetTransaction();
  const { L1MESSENGER_CONTRACT } = useContract();
  const { address } = useAccount();

  const claim = async (tx: any) => {
    const isConnectedToL1 =
      connectedChainId === SupportedChainId["MAINNET"] ||
      connectedChainId === SupportedChainId["GOERLI"];
    console.log("fdfdfdjhfaksfma", tx);
    const provider = getL1Provider();
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

    try {
      console.log("L1BRIDGE_CONTRACT", L1MESSENGER_CONTRACT);

      const messengerContract = new ethers.Contract(
        L1MESSENGER_CONTRACT,
        L1CrossDomainMessenger_ABI,
        provider
      );

      const messenger = tData.crossChainMessenger;
      console.log("messenger", tx, messenger);

      const proof = await messenger.getMessageProof(tx.resolved);
      console.log("proof", proof);

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
        from: address
      });
      //     const eventSendMessage = await crossChainMessenger.toCrossChainMessage(tx.l2txHash)
      // console.log(`eventSendMessage : `, eventSendMessage)
      // const currentStatus = await crossChainMessenger.getMessageStatus(eventSendMessage)
      // console.log(`currentStatus : `, currentStatus)
      //     const finalize = await crossChainMessenger.finalizeMessage(
      //       tx.l2TxReceipt
      //     );
      //     console.log("finalize", finalize);
    } catch (e) {
      console.log("e", e);
    }
  };

  return { claim };
}
