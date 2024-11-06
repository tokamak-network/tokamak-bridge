import { useAccount, useNetwork, useWalletClient } from "wagmi";
const thanosSDK = require("@tokamak-network/thanos-sdk");
import { ethers } from "ethers";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { useCallback, useEffect, useMemo, useState } from "react";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import { getTokenAddressByChainId } from "@/constant/contracts/tokens";

export const useThanosSDK = (
  l1ChainId: SupportedChainId | null,
  l2ChainId: SupportedChainId | null
) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [crossChainMessenger, setCrossChainMessenger] = useState<any>(null);
  useEffect(() => {
    if (!l1ChainId || !l2ChainId) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const cm = new thanosSDK.CrossChainMessenger({
      bedrock: true,
      l1ChainId: l1ChainId,
      l2ChainId: l2ChainId,
      l1SignerOrProvider: provider.getSigner(),
      l2SignerOrProvider: provider.getSigner(),
      nativeTokenAddress: getTokenAddressByChainId("TON", l1ChainId),
    });
    setCrossChainMessenger(cm);
  }, [l1ChainId, l2ChainId, chain]);

  const estimateGas = useMemo(() => {
    if (!crossChainMessenger) return null;
    return crossChainMessenger.estimateGas;
  }, [crossChainMessenger]);

  return { crossChainMessenger, estimateGas };
};
