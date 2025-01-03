import { networkStatus } from "@/recoil/bridgeSwap/atom";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { supportedChain } from "@/types/network/supportedNetwork";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";
import { useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useGetPositionIdFromPath } from "../pool/useGetPositionIds";

export function useInOutNetwork() {
  const { inNetwork, outNetwork } = useRecoilValue(networkStatus);

  return {
    inNetwork,
    outNetwork,
  };
}

export default function useConnectedNetwork() {
  const { inNetwork } = useInOutNetwork();
  const { chain: _chain } = useNetwork();

  const chain = useMemo(() => {
    return _chain;
  }, [_chain]);

  //to optimize rpc calls
  //if it's enabled always, then useNetwork would make so many calls to check connectecd network datas when it's not connected
  const chainInfo = useMemo(() => {
    //connected wallet

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
          chain.id === SupportedChainId.MAINNET ||
          chain.id === SupportedChainId.TITAN,
        isConnectedToTestNetwork:
          chain.id === SupportedChainId.SEPOLIA ||
          chain.id === SupportedChainId.TITAN_SEPOLIA ||
          chain.id === SupportedChainId.THANOS_SEPOLIA,
        blockExplorer: chain.blockExplorers?.default.url,
      };
    }
    //not connected wallet but select a network
    if (inNetwork) {
      return {
        connectedChainId: inNetwork.chainId,
        isSupportedChain: Object.values(SupportedChainId).includes(
          inNetwork.chainId
        ),
        chainName: inNetwork.chainName,
        layer:
          supportedChain.filter((e) => e.chainId === inNetwork.chainId)[0]
            ?.layer ?? null,
        isConnectedToMainNetwork:
          inNetwork.chainId === SupportedChainId.MAINNET ||
          inNetwork.chainId === SupportedChainId.TITAN,
        isConnectedToTestNetwork:
          inNetwork.chainId === SupportedChainId.SEPOLIA ||
          inNetwork.chainId === SupportedChainId.TITAN_SEPOLIA ||
          inNetwork.chainId === SupportedChainId.THANOS_SEPOLIA,
        blockExplorer: "",
      };
    }
    return { chainName: "MAINNET" as keyof typeof SupportedChainId };
  }, [chain, inNetwork]);

  const otherLayerChainInfo = useMemo(() => {
    // Corrected the network sequence due to the removal of the Goerli network.
    // Appropriate adjustments will be made upon the introduction of the Sepolia network. -@Robert
    if (chainInfo) {
      if (chainInfo.layer === "L1" && chainInfo.isConnectedToMainNetwork)
        return supportedChain[2];
      if (chainInfo.layer === "L1" && !chainInfo.isConnectedToMainNetwork)
        // connect to Titan Sepolia for now
        return supportedChain[4];
      if (chainInfo.layer === "L2" && chainInfo.isConnectedToMainNetwork)
        return supportedChain[0];
      if (chainInfo.layer === "L2" && !chainInfo.isConnectedToMainNetwork)
        return supportedChain[1];
    }
  }, [chainInfo]);

  const chainGroup = useMemo(() => {
    if (chainInfo) {
      if (chainInfo.isConnectedToMainNetwork) {
        return supportedChain.filter((chain) => !chain.isTestnet);
      }

      return supportedChain
        .filter((chain) => chain.isTestnet)
        .filter((chain) => chain.chainId !== SupportedChainId.THANOS_SEPOLIA);
    }
  }, [chainInfo]);

  const isLayer2 = useMemo(() => {
    return chainInfo.layer === "L2";
  }, [chainInfo.layer]);

  const connectedToLayer1 = useMemo(() => {
    if (chainInfo.connectedChainId) {
      if (chainInfo.isConnectedToMainNetwork)
        return chainInfo.connectedChainId === SupportedChainId.MAINNET;
      return chainInfo.connectedChainId === SupportedChainId.SEPOLIA;
    }
    return false;
  }, [chainInfo.connectedChainId, chainInfo.isConnectedToMainNetwork]);

  return {
    ...chainInfo,
    otherLayerChainInfo,
    chainGroup,
    isLayer2,
    connectedToLayer1,
  };
}

export const useChangeNetwork = (chainId?: number) => {
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  const { switchNetworkAsync } = useSwitchNetwork();

  const switchNetworkWithChainId = useCallback(() => {
    if (chainId) switchNetworkAsync?.(chainId);
  }, [chainId]);

  const switchToEthereum = useCallback(() => {
    if (isConnectedToMainNetwork)
      return switchNetworkAsync?.(SupportedChainId.MAINNET);
    switchNetworkAsync?.(SupportedChainId.SEPOLIA);
  }, [switchNetworkAsync, isConnectedToMainNetwork]);

  const switchToTitan = useCallback(() => {
    if (isConnectedToMainNetwork)
      return switchNetworkAsync?.(SupportedChainId.TITAN);
    switchNetworkAsync?.(SupportedChainId.TITAN_SEPOLIA);
  }, [switchNetworkAsync, isConnectedToMainNetwork]);

  const switchToSepolia = useCallback(() => {
    switchNetworkAsync?.(SupportedChainId.SEPOLIA);
  }, [switchNetworkAsync]);

  return {
    switchNetworkWithChainId,
    switchToEthereum,
    switchToTitan,
    switchToSepolia,
  };
};
