import { getL1Provider } from "@/config/l1Provider";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { useRecoilValue } from "recoil";
import useConnectedNetwork, { useInOutNetwork } from "../network";
import { getL2Provider } from "@/config/l2Provider";
import { ethers } from "ethers";
import { useMemo } from "react";
import { usePublicClient } from "wagmi";

export function useProvier() {
  const { inNetwork } = useInOutNetwork();
  const { connectedChainId } = useConnectedNetwork();

  const provider = useMemo(() => {
    if (!window.ethereum) {
      return inNetwork?.layer === "L1" ? getL1Provider() : getL2Provider();
    }
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    return provider;
  }, [window, connectedChainId]);

  return { provider };
}
