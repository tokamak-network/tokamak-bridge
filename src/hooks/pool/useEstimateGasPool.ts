import { useState, useEffect } from "react";
import { usePoolContract } from "@/hooks/pool/usePoolContract";
import useBlockNum from "../network/useBlockNumber";
import { useGasPrice } from "../contracts/fee/useGasPrice";
import commafy from "@/utils/trim/commafy";

export function useEstimateGasCollect() {
  const [totalGasPrice, setTotalGasPrice] = useState<string | undefined>(
    undefined
  );
  const [totalGasUsage, setTotalGasUsage] = useState<string | undefined>(
    undefined
  );
  const { estimateGasToCollect } = usePoolContract();
  const { blockNumber } = useBlockNum();

  return { totalGasPrice };
}
