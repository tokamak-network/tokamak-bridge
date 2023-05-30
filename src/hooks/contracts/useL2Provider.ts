import { l2RpcProvider } from "@/config/l2Provider";
import { useMemo, useState, useEffect } from "react";

export function useL2Provider() {}

export function useTotalGas(contract: any) {
  const [l1GasCost, setL1GasCost] = useState<bigint | null>(null);
  const [l2GasCost, setL2GasCost] = useState<bigint | null>(null);

  useEffect(() => {
    const fetchGasCost = async () => {
      if (contract && l2RpcProvider) {
        const l1gas = await l2RpcProvider.estimateL1GasCost(contract);
        const l2gas = await l2RpcProvider.estimateL2GasCost(contract);

        setL1GasCost(l1gas.toBigInt());
        setL2GasCost(l2gas.toBigInt());
      }
    };
    fetchGasCost().catch((e) => console.log(e));
  }, [contract]);

  return { l1GasCost, l2GasCost };
}
