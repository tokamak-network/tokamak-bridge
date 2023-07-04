import { networkStatus } from "@/recoil/bridgeSwap/atom";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { supportedChain } from "@/types/network/supportedNetwork";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";
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
      const chainName = getKeyByValue(SupportedChainId, chain.id);
      return {
        connectedChainId: chain.id,
        isSupportedChain: Object.values(SupportedChainId).includes(chain.id),
        chainName,
        layer:
          supportedChain.filter((e) => e.chainId === chain.id)[0]?.layer ??
          null,
        isConnectedToMainNetwork:
          chain.id === SupportedChainId["MAINNET"] ||
          chain.id === SupportedChainId["TITAN"],
        blockExplorer: chain.blockExplorers?.default.url,
      };
    }
    return { chainName: "MAINNET" as keyof typeof SupportedChainId };
  }, [chain]);

  return { ...chainInfo };
}
