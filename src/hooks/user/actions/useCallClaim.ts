import useConnectedNetwork from "@/hooks/network";
import {
  SupportedChainId,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { useRecoilState } from "recoil";
import L1CrossDomainMessenger_ABI from "constant/abis/L1CrossDomainMessenger.json";
import useContract from "@/hooks/contracts/useContract";
import { confirmWithdrawData, confirmWithdrawStats } from "@/recoil/modal/atom";
import { useCallback, useEffect } from "react";
import { useContractWrite, useSwitchNetwork } from "wagmi";
import { useTx } from "@/hooks/tx/useTx";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { useProvier } from "@/hooks/provider/useProvider";
import useCrosschainMessenger from "../useCrosschainMessenger";
import { claimModalStatus } from "@/recoil/modal/atom";
import { getWithdarwCalldata } from "@/utils/history/getWithdrawCalldata";

export default function useCallClaim(functionName: string) {
  const { connectedChainId, isConnectedToMainNetwork, layer } =
    useConnectedNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { L1MESSENGER_CONTRACT } = useContract();
  const [, setWithdrawStatus] = useRecoilState(confirmWithdrawStats);
  const [, setWithdrawData] = useRecoilState(confirmWithdrawData);
  const { crossMessenger } = useCrosschainMessenger();
  const [, setClaimModal] = useRecoilState(claimModalStatus);

  const { data, write, isError } = useContractWrite({
    address: L1MESSENGER_CONTRACT,
    abi: L1CrossDomainMessenger_ABI,
    functionName,
  });
  const { setModalOpen, setIsOpen } = useTxConfirmModal();

  const {} = useTx({ hash: data?.hash, txSort: "Claim" });

  useEffect(() => {
    if (isError) {
      setModalOpen("error");
    }
  }, [isError]);

  const getProof = async (txt: any) => {
    const proof = await crossMessenger.getMessageProof(txt.resolved);
    return proof;
  };

  const { L1Provider, L2Provider } = useProvier();

  const claim = useCallback(
    async (txt: any) => {
      setClaimModal(true);
      setIsOpen(true);
      setModalOpen("confirming");

      // const proof = await getWithdarwCalldata({
      //   hash: txt.stateBatchAppendedEvent.transactionHash,
      //   //@ts-ignore
      //   provider: L1Provider,
      //   l2Provider: l2Provider,
      //   stateBatchAppendedEvent: txt.stateBatchAppendedEvent,
      //   sentMessageEvent: { ...txt.resolved, blockNumber: txt.blockNumber },
      //   l2BlcokNumber: txt.blockNumber,
      // });

      getWithdarwCalldata({
        hash: txt.stateBatchAppendedEvent.transactionHash,
        //@ts-ignore
        provider: L1Provider,
        //@ts-ignore
        l2Provider: L2Provider,
        stateBatchAppendedEvent: txt.stateBatchAppendedEvent,
        sentMessageEvent: {
          ...txt.resolved,
          blockNumber: Number(txt.blockNumber),
        },
        l2BlcokNumber: Number(txt.blockNumber),
      }).then(async (proof) => {
        setClaimModal(false);

        if (Boolean(layer !== "L1") || layer === "L2") {
          const selectedWork = supportedChain.filter((supportedChain) => {
            if (isConnectedToMainNetwork === true) {
              return [SupportedChainId["MAINNET"]].includes(
                supportedChain.chainId
              );
            } else {
              // return [SupportedChainId["GOERLI"]].includes(
              //   supportedChain.chainId
              // );
            }
          })[0];

          const res = await switchNetworkAsync?.(selectedWork.chainId);
          const tx = txt;

          if (res) {
            try {
              write({
                args: [
                  tx.resolved.target,
                  tx.resolved.sender,
                  tx.resolved.message,
                  tx.resolved.messageNonce,
                  proof,
                ],
              });
              setIsOpen(true);
              setModalOpen("confirming");
              setWithdrawData({ modalData: null });
              setWithdrawStatus({ isOpen: false });
            } catch (e) {
              console.log(e);
              setClaimModal(false);
            }
          }
        } else {
          console.log(
            "target : ",
            txt.resolved.target,
            "sender : ",
            txt.resolved.sender,
            "message : ",
            txt.resolved.message,
            "messageNonce : ",
            txt.resolved.messageNonce,
            "proof : ",
            proof
          );
          try {
            write({
              args: [
                txt.resolved.target,
                txt.resolved.sender,
                txt.resolved.message,
                txt.resolved.messageNonce,
                proof,
              ],
            });
            setIsOpen(true);
            setModalOpen("confirming");
            setWithdrawData({ modalData: null });
            setWithdrawStatus({ isOpen: false });
          } catch (e) {
            console.log(e);
            setClaimModal(false);
          }
        }
      });
    },
    [layer, connectedChainId, switchNetworkAsync]
  );

  return { claim };
}
