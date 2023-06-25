import { TxSort } from "@/types/tx/txType";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useWaitForTransaction } from "wagmi";
import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import ERC20Abi from "@/abis/erc20.json";
import { useRecoilState } from "recoil";
import { txData } from "@/recoil/global/transaction";
import useConnectedNetwork from "../network";

const getInterface = () => {
  const l1BridgeI = new ethers.utils.Interface(L1BridgeAbi);
  const l2BridgeI = new ethers.utils.Interface(L2BridgeAbi);
  const routerI = new ethers.utils.Interface(L1BridgeAbi);
  const erc20I = new ethers.utils.Interface(ERC20Abi.abi);

  return { l1BridgeI, l2BridgeI, routerI, erc20I };
};

export function useTx(params: {
  hash: `0x${string}` | undefined;
  txType: TxSort;
}) {
  const { hash, txType } = params;
  const { isLoading, isSuccess, isError, data } = useWaitForTransaction({
    hash,
  });
  const [, setTxData] = useRecoilState(txData);
  const { connectedChainId } = useConnectedNetwork();

  useEffect(() => {
    if (isLoading) {
    }
    if (isSuccess && data && connectedChainId) {
      const { logs } = data;

      const { l1BridgeI, l2BridgeI, routerI, erc20I } = getInterface();
      switch (txType) {
        //Uniswap
        case "Add Liquidity":
          return;
        case "Remove Liquidity":
          return;
        case "Swap":
          return;
        case "Collect Fee":
          return;
        //bridge
        case "Deposit":
          // const result = l1BridgeI.parseLog(logs[logs.length - 1]);
          // const { args } = result;
          return;
        case "Withdraw":
          const result = l2BridgeI.parseLog(logs[logs.length - 1]);
          const { args } = result;
          const { _l1Token, _l2Token, _amount } = args;
          return setTxData({
            txHash: hash,
            txSort: "Withdraw",
            transactionState: "success",
            tokenData: [
              {
                tokenAddress: _l2Token,
                amount: _amount,
              },
              {
                tokenAddress: _l1Token,
                amount: _amount,
              },
            ],
            network: connectedChainId,
          });
        //wrap
        case "Wrap":
          return;
        case "Unwrap":
          return;
        //etc
        case "Approve":
          return;
        default:
          break;
      }
    }
    if (isError) {
    }
  }, [isLoading, isSuccess, isError, txType, data, connectedChainId]);
}
