import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import { useFeeData } from "wagmi";
import commafy from "@/utils/trim/commafy";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";

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

export default useRelayGas;
