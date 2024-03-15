import { PoolCardDetail } from "@/app/pools/components/PoolCard";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import useConnectedNetwork from "../network";

export function useIsOwner(info: PoolCardDetail | undefined) {
  const { address } = useAccount();
  const { connectedChainId } = useConnectedNetwork();
  const isOwner = useMemo(() => {
    return address === info?.owner;
  }, [address, info?.owner]);

  const isOnSameNetwork = useMemo(() => {
    return connectedChainId === info?.chainId;
  }, [connectedChainId, info?.chainId]);

  const needToRedirect = useMemo(() => {
    if (info === undefined) return true;
    return !isOwner || !isOnSameNetwork;
  }, [isOwner, isOnSameNetwork, info]);

  return { isOwner, isOnSameNetwork, needToRedirect };
}
