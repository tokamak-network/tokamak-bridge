import { getL1Provider } from "@/config/l1Provider";
import useConnectedNetwork from "../network";
import { getL2Provider } from "@/config/l2Provider";
import { ethers } from "ethers";
import { useMemo } from "react";
import { supportedChain } from "@/types/network/supportedNetwork";
import { getProvider } from "@/config/getProvider";

export function useProvier() {
  const { isConnectedToMainNetwork, layer, connectedChainId } =
    useConnectedNetwork();

  const L1Provider = useMemo(() => {
    if (isConnectedToMainNetwork)
      return getProvider(supportedChain[0]) as ethers.providers.JsonRpcProvider;
    return getProvider(supportedChain[1]) as ethers.providers.JsonRpcProvider;
  }, [isConnectedToMainNetwork]);

  const L2Provider = useMemo(() => {
    if (isConnectedToMainNetwork)
      return getProvider(supportedChain[2]) as ethers.providers.JsonRpcProvider;
    return getProvider(supportedChain[3]) as ethers.providers.JsonRpcProvider;
  }, [isConnectedToMainNetwork]);

  const otherLayerProvider = useMemo(() => {
    //Ethereum or Titan
    if (isConnectedToMainNetwork) {
      if (layer === "L1") return getProvider(supportedChain[2]);
      return getProvider(supportedChain[0]);
    }
    //Testnet
    if (layer === "L1") return getProvider(supportedChain[3]);
    return getProvider(supportedChain[1]);
  }, [isConnectedToMainNetwork, layer]);

  const provider = useMemo(() => {
    if (!window.ethereum) {
      return layer === "L1" ? L1Provider : L2Provider;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider;
  }, [window.ethereum, connectedChainId, layer]);

  return { provider, L1Provider, L2Provider, otherLayerProvider };
}
