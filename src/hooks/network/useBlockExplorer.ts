import { BLOCKEXPLORER_CONSTANTS } from "@/staging/constants/blockexplorer";
import useConnectedNetwork from ".";
import { useMemo } from "react";
import { SupportedChainId } from "@/types/network/supportedNetwork";

export const useBlockExplorer = () => {
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  const ethereumExplorer = useMemo(() => {
    if (isConnectedToMainNetwork) {
      return BLOCKEXPLORER_CONSTANTS[SupportedChainId.MAINNET];
    }
    return BLOCKEXPLORER_CONSTANTS[SupportedChainId.SEPOLIA];
  }, [isConnectedToMainNetwork, BLOCKEXPLORER_CONSTANTS]);

  const titanExplorer = useMemo(() => {
    if (isConnectedToMainNetwork) {
      return BLOCKEXPLORER_CONSTANTS[SupportedChainId.TITAN];
    }
    return BLOCKEXPLORER_CONSTANTS[SupportedChainId.TITAN_SEPOLIA];
  }, [isConnectedToMainNetwork, BLOCKEXPLORER_CONSTANTS]);

  return { ethereumExplorer, titanExplorer };
};
