import { useMemo } from "react";

const useChainIds = (connectedNetwork: any) => {
  const ethChainId = useMemo(() => {
    if (
      !connectedNetwork ||
      typeof connectedNetwork.connectedChainId !== "number"
    ) {
      return 1;
    }

    return connectedNetwork.connectedChainId === 1 ||
      connectedNetwork.connectedChainId === 55004
      ? 1
      : 11155111;
  }, [connectedNetwork]);

  const titanChainId = useMemo(() => {
    if (
      !connectedNetwork ||
      typeof connectedNetwork.connectedChainId !== "number"
    ) {
      return 55004;
    }
    return connectedNetwork.connectedChainId === 1 ||
      connectedNetwork.connectedChainId === 55004
      ? 55004
      : 55007;
  }, [connectedNetwork]);

  return { ethChainId, titanChainId };
};

export default useChainIds;
