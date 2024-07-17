import useContract from "@/hooks/contracts/useContract";
import { useContractWrite } from "wagmi";
import L2CrossTradeAbi from "@/abis/L2CrossTrade.json";
import { useTx } from "@/hooks/tx/useTx";

export const useRequestRegisteredToken = () => {
  const { L2CrossTrade_CONTRACT } = useContract();

  const { data, write } = useContractWrite({
    address: L2CrossTrade_CONTRACT.L2CrossTradeProxy,
    abi: L2CrossTradeAbi.abi,
    functionName: "requestRegisteredToken",
  });
  const {} = useTx({ hash: data?.hash, txSort: "Withdraw" });

  return { callToRequest: write };
};
