import { getL1Provider } from "@/config/l1Provider";
import useConnectedNetwork, { useInOutNetwork } from "../network";
import { getL2Provider } from "@/config/l2Provider";
import { ethers } from "ethers";
import { useMemo } from "react";
import { supportedChain } from "@/types/network/supportedNetwork";
import { getProvider } from "@/config/getProvider";

export function useProvier() {
  const { inNetwork } = useInOutNetwork();
  const { connectedChainId, isConnectedToMainNetwork, layer } =
    useConnectedNetwork();

  const L1Provider = useMemo(() => {
    if (isConnectedToMainNetwork) return getProvider(supportedChain[0]);
    return getProvider(supportedChain[0]);
  }, [isConnectedToMainNetwork]);

  const L2Provider = useMemo(() => {
    if (isConnectedToMainNetwork) return getProvider(supportedChain[1]);
    return getProvider(supportedChain[1]);
  }, [isConnectedToMainNetwork]);

  const otherLayerProvider = useMemo(() => {
    //Ethereum or Titan
    if (isConnectedToMainNetwork) {
      if (layer === "L1") return getProvider(supportedChain[0]);
      return getProvider(supportedChain[0]);
    }
    //Testnet
    if (layer === "L1") return getProvider(supportedChain[0]);
    return getProvider(supportedChain[1]);
  }, [isConnectedToMainNetwork, layer]);

  const provider = useMemo(() => {
    if (!window.ethereum) {
      return inNetwork?.layer === "L1" ? L1Provider : L2Provider;
    }
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    return provider;
  }, [window, connectedChainId, L1Provider, L2Provider]);

  return { provider, L1Provider, L2Provider, otherLayerProvider };
}
