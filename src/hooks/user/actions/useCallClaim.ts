import useConnectedNetwork from "@/hooks/network";
import {
  SupportedChainId,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { useRecoilState } from "recoil";
import { networkStatus } from "@/recoil/bridgeSwap/atom";
import { useSwitchNetwork } from "wagmi";
import useGetTransaction from "../useGetTransaction";

export default function useCallClaim() {
  const { connectedChainId, isConnectedToMainNetwork, layer } =
    useConnectedNetwork();
  const [network, setNetwork] = useRecoilState(networkStatus);
  const { switchNetworkAsync, isError, switchNetwork } = useSwitchNetwork();
  const tData = useGetTransaction();

  const claim = async (tx:any) => {    
    const isConnectedToL1 =
      connectedChainId === SupportedChainId["MAINNET"] ||
      connectedChainId === SupportedChainId["GOERLI"];
    console.log("fdfdfdjhfaksfma",tx);

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

  console.log('tData',tData);
  

    const crossChainMessenger = tData.crossChainMessenger;
    console.log('crossChainMessenger',crossChainMessenger);
    

    try {
      const eventSendMessage = await crossChainMessenger.toCrossChainMessage(tx.l2txHash)
  console.log(`eventSendMessage : `, eventSendMessage)
  const currentStatus = await crossChainMessenger.getMessageStatus(eventSendMessage)
  console.log(`currentStatus : `, currentStatus)


      const finalize = await crossChainMessenger.finalizeMessage(
        tx.l2TxReceipt
      );
      console.log("finalize", finalize);
    } catch (e) {
      console.log("e", e);
    }
  };

  return { claim };
}
