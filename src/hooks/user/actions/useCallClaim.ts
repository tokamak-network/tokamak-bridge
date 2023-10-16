import useConnectedNetwork from "@/hooks/network";
import {
  SupportedChainId,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { useRecoilState, useRecoilValue } from "recoil";
import L1CrossDomainMessenger_ABI from "constant/abis/L1CrossDomainMessenger.json";
import useContract from "@/hooks/contracts/useContract";
import { confirmWithdrawData, confirmWithdrawStats } from "@/recoil/modal/atom";
import { useCallback, useEffect } from "react";
import { useContractWrite, useSwitchNetwork } from "wagmi";
import { useTx } from "@/hooks/tx/useTx";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { useProvier } from "@/hooks/provider/useProvider";
import useCrosschainMessenger from "../useCrosschainMessenger";
import { claimTx } from "@/recoil/userHistory/claimTx";

export default function useCallClaim(functionName: string) {
  const { connectedChainId, isConnectedToMainNetwork, layer } =
    useConnectedNetwork();
  const {
    switchNetworkAsync,
    error,
    isError: switchNetworkError,
    status,
  } = useSwitchNetwork();
  const { L1MESSENGER_CONTRACT } = useContract();
  const [, setWithdrawStatus] = useRecoilState(confirmWithdrawStats);
  const [, setWithdrawData] = useRecoilState(confirmWithdrawData);
  const [claimTX, setClaimTX] = useRecoilState(claimTx);
  const { crossMessenger } = useCrosschainMessenger();
  const { provider, L2Provider } = useProvier();
  const l2Pro = layer === "L2" ? provider : L2Provider;

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
      setClaimTX(undefined);
    }
  }, [isError]);

  console.log("isError", isError);

  useEffect(() => {
    if (switchNetworkError) {
      setModalOpen("error");
      setClaimTX(undefined);
    }
  }, [switchNetworkError]);

  const claim = useCallback(
    async (txt: any) => {
      const proof = await crossMessenger.getMessageProof(txt.resolved);
      if (Boolean(layer !== "L1") || layer === "L2") {
        const selectedWork = supportedChain.filter((supportedChain) => {
          if (isConnectedToMainNetwork === true) {
            return [SupportedChainId["MAINNET"]].includes(
              supportedChain.chainId
            );
          } else {
            return [SupportedChainId["GOERLI"]].includes(
              supportedChain.chainId
            );
          }
        })[0];

        try {
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
            } finally {
              console.log("errorrrrrr");
              setClaimTX(undefined);
            }
          }

          // setClaimTX(undefined)
        } finally {
          setClaimTX(undefined);
        }
      } else {
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
          // setClaimTX(undefined)
        } finally {
          setClaimTX(undefined);
        }
      }
    },
    [layer, connectedChainId, switchNetworkAsync]
  );

  return { claim };
}
