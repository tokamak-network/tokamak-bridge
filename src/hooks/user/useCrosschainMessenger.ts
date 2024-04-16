import { useMemo } from "react";
import useGetTxLayers from "./useGetTxLayers";
import { useAccount } from "wagmi";
import useConnectedNetwork from "../network";
import { useProvier } from "../provider/useProvider";
import { getProvider } from "@/config/getProvider";
import { ethers } from "ethers";
// @ts-ignore
import * as titanSDK from "@tokamak-network/tokamak-layer2-sdk";

export default function useCrosschainMessenger() {
  const providers = useGetTxLayers();
  const { provider } = useProvier();
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { address } = useAccount();
  const { layer, connectedChainId } = useConnectedNetwork();
  const l2Pro = layer === "L2" ? provider : getProvider(providers.l2Provider);
  const l1Pro = layer === "L1" ? provider : getProvider(providers.l1Provider);

  const rpcCrossMessenger = useMemo(() => {
    if (l1Pro !== undefined && l2Pro !== undefined) {
      const crossChainMessenger = new titanSDK.CrossChainMessenger({
        l1ChainId: providers.l1ChainID,
        l2ChainId: providers.l2ChainID,
        l1SignerOrProvider:
          layer === "L1"
            ? isConnectedToMainNetwork
              ? new ethers.providers.JsonRpcProvider(
                  process.env.NEXT_PUBLIC_INFURA_RPC_ETHEREUM
                )
              : l1Pro.getSigner(address)
            : new ethers.providers.JsonRpcProvider(
                isConnectedToMainNetwork
                  ? process.env.NEXT_PUBLIC_INFURA_RPC_ETHEREUM
                  : process.env.NEXT_PUBLIC_SEPOLIA_RPC
              ).getSigner(address),
        l2SignerOrProvider: l2Pro.getSigner(address),
      });

      return crossChainMessenger;
    }
  }, [l1Pro, l2Pro, layer]);

  const tokamakCrossMessenger = useMemo(() => {
    if (l1Pro !== undefined && l2Pro !== undefined) {
      const crossChainMessenger = new titanSDK.CrossChainMessenger({
        l1ChainId: providers.l1ChainID,
        l2ChainId: providers.l2ChainID,
        l1SignerOrProvider:
          layer === "L1"
            ? l1Pro.getSigner(address)
            : new ethers.providers.JsonRpcProvider(
                isConnectedToMainNetwork
                  ? process.env.NEXT_PUBLIC_ETHEREUM_RPC
                  : process.env.NEXT_PUBLIC_SEPOLIA_RPC
              ).getSigner(address),
        l2SignerOrProvider: l2Pro.getSigner(address),
      });
      return crossChainMessenger;
    }
  }, [l1Pro, l2Pro, layer]);

  return {
    crossMessenger: rpcCrossMessenger,
    crossMessengerTokamak: tokamakCrossMessenger,
  };
}
