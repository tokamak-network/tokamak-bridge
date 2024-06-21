import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useFeeData } from "wagmi";
import commafy from "@/utils/trim/commafy";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";

const useRelayGas = (gasLimit: number, chainId: number) => {
  const [usGasCost, setUsGasCost] = useState("0");
  const [totalGasCost, setTotalGasCost] = useState("0");
  const { data: feeData } = useFeeData({ chainId });
  const { tokenMarketPrice } = useGetMarketPrice({ tokenName: "ethereum" });

  useEffect(() => {
    const calculateGasCost = () => {
      if (feeData) {
        const { gasPrice } = feeData;
        const gasCost = gasLimit * Number(gasPrice);
        const parsedTotalGasCost = ethers.utils.formatUnits(
          gasCost.toString(),
          "ether"
        );
        setTotalGasCost(parsedTotalGasCost);
        if (tokenMarketPrice) {
          const usTotal = commafy(
            Number(tokenMarketPrice) * Number(parsedTotalGasCost),
            2
          );
          setUsGasCost(usTotal);
        }
      }
    };

    calculateGasCost();
  }, [feeData, gasLimit, chainId]);

  return { usGasCost, totalGasCost };
};

export default useRelayGas;
