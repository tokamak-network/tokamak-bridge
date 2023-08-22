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
import { useProvier } from "@/hooks/provider/useProvider";
import useGetTxLayers from "../useGetTxLayers";

export default function useCallClaim(functionName: string) {
  const { connectedChainId, isConnectedToMainNetwork, layer } =
    useConnectedNetwork();
  const [claimTxArgs, setClaimTxArgs] = useRecoilState(claimTx);

  const [network, setNetwork] = useRecoilState(networkStatus);
  const { switchNetworkAsync, switchNetwork } = useSwitchNetwork();
  const { L1MESSENGER_CONTRACT } = useContract();
  const { address } = useAccount();
  const [isConnectedToL1, setIsConnectedToL1] = useState(false);
  const [withdraw, setWithdraw] = useRecoilState(confirmWithdraw);
  const [resolvd, setResolvd] = useState(claimTxArgs);
  const titanSDK = require("@tokamak-network/tokamak-layer2-sdk");
  const providers = useGetTxLayers();

  const { data, write, isError } = useContractWrite({
    address: L1MESSENGER_CONTRACT,
    abi: L1CrossDomainMessenger_ABI,
    functionName,
  });
  const { provider } = useProvier();

  const { setModalOpen, setIsOpen } = useTxConfirmModal();

  //const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction()
  useEffect(() => {
    const isCnnctdToL1 =
      connectedChainId === SupportedChainId["MAINNET"] ||
      connectedChainId === SupportedChainId["GOERLI"];
    setIsConnectedToL1(isCnnctdToL1);
  }, [connectedChainId]);

  // console.log("resolvd,", resolvd);

  // const changeNetwork = useCallback(async () => {
  //   if (!isConnectedToL1) {
  //     const selectedWork = supportedChain.filter((supportedChain) => {
  //       if (isConnectedToMainNetwork === true) {
  //         return [SupportedChainId["MAINNET"]].includes(supportedChain.chainId);
  //       } else {
  //         return [SupportedChainId["GOERLI"]].includes(supportedChain.chainId);
  //       }
  //     })[0];

  //     const xx = await switchNetworkAsync?.(selectedWork.chainId);
  //     console.log("xx", xx);

  //     if (xx?.id === 5 || xx?.id === 1) {
  //       return claisss();
  //     }
  //   } else {
  //     return claisssXX();
  //   }
  // }, [cross, connectedChainId, provider]);

  const {} = useTx({ hash: data?.hash, txSort: "Claim" });

  useEffect(() => {
    if (isError) {
      setModalOpen("error");
    }
  }, [isError]);

  // const claisss = useCallback(async () => {
  //   // console.log("came to claisss");
  //   // console.log("resolvd", resolvd);
  //   // maybe take resolved as a parameter to the claim function and try again
  //   try {
  //     if (resolvd !== undefined) {
  //       const proof = await cross.getMessageProof(resolvd.resolved);

  //       // console.log("proof123", proof);

  //       setIsOpen(true);
  //       setModalOpen("confirming");
  //       setWithdraw({
  //         isOpen: false,
  //         modalData: null,
  //       });
  //       write({
  //         args: [
  //           resolvd.resolved.target,
  //           resolvd.resolved.sender,
  //           resolvd.resolved.message,
  //           resolvd.resolved.messageNonce,
  //           proof,
  //         ],
  //       });

  //       return setClaimTxArgs(null);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, [cross, connectedChainId, provider]);

  // const claisssXX = useCallback(async () => {
  //   try {
  //     if (resolvd !== undefined) {
  //       const proof = await cross.getMessageProof(resolvd.resolved);
  //       console.log("proof456", proof);

  //       setIsOpen(true);
  //       setModalOpen("confirming");
  //       setWithdraw({
  //         isOpen: false,
  //         modalData: null,
  //       });
  //       return write({
  //         args: [
  //           resolvd.resolved.target,
  //           resolvd.resolved.sender,
  //           resolvd.resolved.message,
  //           resolvd.resolved.messageNonce,
  //           proof,
  //         ],
  //       });
  //       return setClaimTxArgs(null);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, [cross, connectedChainId]);

  const claim = useCallback(
    async (txt: any) => {
      if (!isConnectedToL1) {
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
        const xx = txt;
        const res = await switchNetworkAsync?.(selectedWork.chainId);
        if (res) {
          try {
            console.log("providers", providers.l1ChainID, providers.l2ChainID);

            const crossChainMessenger = new titanSDK.CrossChainMessenger({
              l1ChainId: providers.l1ChainID,
              l2ChainId: providers.l2ChainID,
              l1SignerOrProvider: new ethers.providers.JsonRpcProvider(
                process.env.NEXT_PUBLIC_INFURA_RPC_GOERLI
              ).getSigner(address),
              l2SignerOrProvider: new ethers.providers.JsonRpcProvider(
                process.env.NEXT_PUBLIC_TITAN_GOERLI_RPC
              ).getSigner(address),
            });

            console.log("claimTxArgs", xx);

            const proof = await crossChainMessenger.getMessageProof(
              xx.resolved
            );
            console.log(proof);
            setIsOpen(true);
            setModalOpen("confirming");
            return write({
              args: [
                xx.resolved.target,
                xx.resolved.sender,
                xx.resolved.message,
                xx.resolved.messageNonce,
                proof,
              ],
            });
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        try {
          console.log("providers", providers.l1ChainID, providers.l2ChainID);

          const crossChainMessenger = new titanSDK.CrossChainMessenger({
            l1ChainId: providers.l1ChainID,
            l2ChainId: providers.l2ChainID,
            l1SignerOrProvider: new ethers.providers.JsonRpcProvider(
              process.env.NEXT_PUBLIC_INFURA_RPC_GOERLI
            ).getSigner(address),
            l2SignerOrProvider: new ethers.providers.JsonRpcProvider(
              process.env.NEXT_PUBLIC_TITAN_GOERLI_RPC
            ).getSigner(address),
          });

          console.log("claimTxArgs", txt);

          const proof = await crossChainMessenger.getMessageProof(txt.resolved);
          console.log(proof);
          setIsOpen(true);
          setModalOpen("confirming");
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
    [isConnectedToL1, connectedChainId, provider]
  );

  return { claim };
}
