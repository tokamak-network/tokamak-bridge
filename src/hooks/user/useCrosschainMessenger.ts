import { useCallback, useEffect, useState } from "react";
import useGetTxLayers from "./useGetTxLayers";
import { useAccount } from "wagmi";
import useConnectedNetwork from "../network";
import { useProvier } from "../provider/useProvider";
import { getProvider } from "@/config/getProvider";
import { ethers } from "ethers";

export default function useCrosschainMessenger() {
  const [crossMessenger, setCrossMessenger] = useState<any>();
  const titanSDK = require("@tokamak-network/tokamak-layer2-sdk");
  const providers = useGetTxLayers();
  const { provider } = useProvier();
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { address } = useAccount();
  const { layer, connectedChainId } = useConnectedNetwork();
  const l2Pro = layer === "L2" ? provider : getProvider(providers.l2Provider);
  const l1Pro = layer === "L1" ? provider : getProvider(providers.l1Provider);

  const fetchMessenger = useCallback(() => {
    if (l1Pro !== undefined && l2Pro !== undefined) {
      const crossChainMessenger = new titanSDK.CrossChainMessenger({
        l1ChainId: providers.l1ChainID,
        l2ChainId: providers.l2ChainID,
        l1SignerOrProvider:
          layer === "L1"
            ? l1Pro.getSigner(address)
            : new ethers.providers.JsonRpcProvider(
                isConnectedToMainNetwork
                  ? process.env.NEXT_PUBLIC_INFURA_RPC_ETHEREUM
                  : process.env.NEXT_PUBLIC_INFURA_RPC_GOERLI
              ).getSigner(address),
        l2SignerOrProvider: l2Pro.getSigner(address),
      });

      setCrossMessenger(crossChainMessenger);
    }
  }, [l1Pro, l2Pro, layer]);

  // const fetL1CrossMessenger = useCallback(() => {
  //   const crossChainMessenger = new titanSDK.CrossChainMessenger({
  //     l1ChainId: providers.l1ChainID,
  //     l2ChainId: providers.l2ChainID,
  //     l1SignerOrProvider: new ethers.providers.JsonRpcProvider(
  //       process.env.NEXT_PUBLIC_INFURA_RPC_GOERLI
  //     ).getSigner(address),
  //     l2SignerOrProvider: new ethers.providers.JsonRpcProvider(
  //       process.env.NEXT_PUBLIC_TITAN_GOERLI_RPC
  //     ).getSigner(address),
  //   });

  //   setL1CrossMessenger(crossChainMessenger);
  // }, []);

  useEffect(() => {
    fetchMessenger();
    // fetL1CrossMessenger();
  }, [l2Pro, l1Pro, layer]);
  return { crossMessenger: crossMessenger };
}
