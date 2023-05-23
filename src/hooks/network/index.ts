import { networkStatus } from "@/recoil/bridgeSwap/atom";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { supportedChain } from "@/types/network/supportedNetwork";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useNetwork } from "wagmi";

export function useInOutNetwork() {
  const { inNetwork, outNetwork } = useRecoilValue(networkStatus);

  return {
    inNetwork,
    outNetwork,
  };
}

export default function useConnectedNetwork() {
  // const network = useRecoilValue(networkStatus);
  const { chain } = useNetwork();

  const chainInfo = useMemo(() => {
    if (chain?.id) {
      return {
        connectedChainId: chain.id,
        isSupportedChain: Object.values(SupportedChainId).includes(chain.id),
      };
    }
  }, [chain]);

  return { ...chainInfo };
}
