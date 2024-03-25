import useConnectedNetwork from "../network";
import { ethers } from "ethers";
import { useMemo } from "react";
import { supportedChain } from "@/types/network/supportedNetwork";
import { getProvider } from "@/config/getProvider";

export function useProvier() {
  const { isConnectedToMainNetwork, layer, connectedChainId } =
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
      return layer === "L1" ? L1Provider : L2Provider;
    }
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    return _provider;
  }, [window.ethereum, connectedChainId, layer]);

  return { provider, L1Provider, L2Provider, otherLayerProvider };
}
