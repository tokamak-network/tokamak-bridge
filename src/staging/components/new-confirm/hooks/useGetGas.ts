import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import { useFeeData } from "wagmi";
import commafy from "@/utils/trim/commafy";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import useConnectedNetwork from "@/hooks/network";

const useRelayGas = (gasLimit: number, chainId: number) => {
  const { data: feeData } = useFeeData({ chainId });
  const { tokenMarketPrice } = useGetMarketPrice({ tokenName: "ethereum" });

  const totalGasCost = useMemo(() => {
    if (feeData) {
      const { gasPrice } = feeData;
      const gasCost = gasLimit * Number(gasPrice);
      const parsedTotalGasCost = ethers.utils.formatUnits(
        gasCost.toString(),
        "ether"
      );
      return parsedTotalGasCost;
    }
  }, [feeData]);

  const usGasCost = useMemo(() => {
    if (tokenMarketPrice && totalGasCost) {
      const usTotal = commafy(Number(tokenMarketPrice) * Number(totalGasCost));
      return usTotal;
    }
  }, [tokenMarketPrice, totalGasCost]);

  return { usGasCost, totalGasCost };
};

export const useRelayGasCost = () => {
  const CLAIM_GAS_USED = 600000 * 1.25;
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const withdrawCost = useRelayGas(
    CLAIM_GAS_USED,
    isConnectedToMainNetwork
      ? SupportedChainId.MAINNET
      : SupportedChainId.SEPOLIA
  );

  return { withdrawCost };
};

export default useRelayGas;
