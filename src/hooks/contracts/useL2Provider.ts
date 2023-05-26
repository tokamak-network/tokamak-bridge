import { l2RpcProvider } from "@/config/l2Provider";
import { useMemo } from "react";

export function useL2Provider() {}

export function useTotalGas(contract: any) {
  const l1GasCost = useMemo(async () => {
    if (contract && l2RpcProvider) {
      const result = await l2RpcProvider.estimateL1GasCost(contract);
      return result;
    }
  }, [contract, l2RpcProvider]);

  const l2GasCost = useMemo(async () => {
    if (contract && l2RpcProvider) {
      const result = await l2RpcProvider.estimateL2GasCost(contract);
      return result;
    }
  }, [contract, l2RpcProvider]);

  return { l1GasCost, l2GasCost };
}
