import { useMemo } from "react";
import { usePublicClient } from "wagmi";

export default function useTransactionDetail(params: any) {
  const { chain, estimateGas } = usePublicClient();

  async function test() {
    const result = await estimateGas(params);
    console.log(result);
  }

  test();

  const gasFee = useMemo(() => {}, []);

  return {};
}
