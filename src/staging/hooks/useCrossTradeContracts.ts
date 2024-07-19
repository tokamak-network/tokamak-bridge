import useContract from "@/hooks/contracts/useContract";
import { useContractWrite } from "wagmi";
import L1CrossTradeAbi from "@/abis/L1CrossTrade.json";
import L2CrossTradeAbi from "@/abis/L2CrossTrade.json";
import { useTx } from "@/hooks/tx/useTx";

const useRequestRegisteredToken = () => {
  const { L2CrossTrade_CONTRACT } = useContract();
  const { data, write } = useContractWrite({
    address: L2CrossTrade_CONTRACT.L2CrossTradeProxy,
    abi: L2CrossTradeAbi.abi,
    functionName: "requestRegisteredToken",
  });
  // const {} = useTx({ hash: data?.hash, txSort: "Withdraw" });

  return { write };
};

const useProvideCT = () => {
  const { L1CrossTrade_CONTRACT } = useContract();
  const { data, write } = useContractWrite({
    address: L1CrossTrade_CONTRACT.L1CrossTradeProxy,
    abi: L1CrossTradeAbi.abi,
    functionName: "provideCT",
  });
  // const {} = useTx({ hash: data?.hash, txSort: "Withdraw" });

  return { write };
};

export const useCrossTradeContract = () => {
  const { write: _requestRegisteredToken } = useRequestRegisteredToken();
  const { write: _provideCT } = useProvideCT();

  return {
    requestRegisteredToken: _requestRegisteredToken,
    provideCT: _provideCT,
  };
};
