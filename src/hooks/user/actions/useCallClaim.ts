import useConnectedNetwork from "@/hooks/network";
import {
  SupportedChainId,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { useRecoilState } from "recoil";
import L1CrossDomainMessenger_ABI from "constant/abis/L1CrossDomainMessenger.json";
import useContract from "@/hooks/contracts/useContract";
import { ethers } from "ethers";
import { confirmWithdrawData, confirmWithdrawStats } from "@/recoil/modal/atom";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useContractWrite, useSwitchNetwork } from "wagmi";
import { useTx } from "@/hooks/tx/useTx";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { useProvier } from "@/hooks/provider/useProvider";
import useGetTxLayers from "../useGetTxLayers";
// @ts-ignore
import * as titanSDK from "@tokamak-network/tokamak-layer2-sdk";

export default function useCallClaim(functionName: string) {
  const { connectedChainId, isConnectedToMainNetwork, layer } =
    useConnectedNetwork();
  const { switchNetworkAsync, switchNetwork } = useSwitchNetwork();
  const { L1MESSENGER_CONTRACT } = useContract();
  const { address } = useAccount();
  const [isConnectedToL1, setIsConnectedToL1] = useState(false);
  const [, setWithdrawStatus] = useRecoilState(confirmWithdrawStats);
  const [, setWithdrawData] = useRecoilState(confirmWithdrawData);
  const providers = useGetTxLayers();
  const { provider, L2Provider } = useProvier();
  const l2Pro = layer === "L2" ? provider : L2Provider;

  const { data, write, isError } = useContractWrite({
    address: L1MESSENGER_CONTRACT,
    abi: L1CrossDomainMessenger_ABI,
    functionName,
  });
  const { setModalOpen, setIsOpen } = useTxConfirmModal();

  const messengerContract = new ethers.Contract(
    L1MESSENGER_CONTRACT,
    L1CrossDomainMessenger_ABI,
    l2Pro
  );
  const crossChainMessenger = new titanSDK.CrossChainMessenger({
    l1ChainId: providers.l1ChainID,
    l2ChainId: providers.l2ChainID,
    l1SignerOrProvider: new ethers.providers.JsonRpcProvider(
      isConnectedToMainNetwork
        ? process.env.NEXT_PUBLIC_INFURA_RPC_ETHEREUM
        : process.env.NEXT_PUBLIC_INFURA_RPC_GOERLI
    ).getSigner(address),
    l2SignerOrProvider: new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_TITAN_GOERLI_RPC
    ).getSigner(address),
  });

  useEffect(() => {
    const isCnnctdToL1 =
      connectedChainId === SupportedChainId["MAINNET"] ||
      connectedChainId === SupportedChainId["GOERLI"];
    setIsConnectedToL1(isCnnctdToL1);
  }, [connectedChainId, layer]);

  const {} = useTx({ hash: data?.hash, txSort: "Claim" });

  const claim = useCallback(
    async (txt: any) => {
      if (!isConnectedToL1 || layer === "L2") {
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
        const res = switchNetworkAsync?.(selectedWork.chainId);
        const tx = txt;
        if (res) {
          try {
            const proof = await crossChainMessenger.getMessageProof(
              tx.resolved
            );
            setIsOpen(true);
            setModalOpen("confirming");
            setWithdrawData({ modalData: null });
            setWithdrawStatus({ isOpen: false });
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
      } else {
        try {
          const proof = await crossChainMessenger.getMessageProof(txt.resolved);
          setIsOpen(true);
          setModalOpen("confirming");
          setWithdrawData({ modalData: null });
          setWithdrawStatus({ isOpen: false });
          return write({
            args: [
              txt.resolved.target,
              txt.resolved.sender,
              txt.resolved.message,
              txt.resolved.messageNonce,
              proof,
            ],
          });
        } catch (e) {
          console.log(e);
        }
      }
    },
    [isConnectedToL1, connectedChainId, switchNetworkAsync]
  );

  return { claim };
}
