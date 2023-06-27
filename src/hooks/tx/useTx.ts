import { TxSort } from "@/types/tx/txType";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useWaitForTransaction } from "wagmi";
import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import ERC20Abi from "@/abis/erc20.json";
import SwapperAbi from "@/abis/SwapperV2.json";
import SwapRouterAbi from "@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json";

import { useRecoilState } from "recoil";
import { txDataStatus } from "@/recoil/global/transaction";
import useConnectedNetwork from "../network";
import { TokenInfo } from "@/types/token/supportedToken";
import { Log } from "viem";

const getInterface = () => {
  const l1BridgeI = new ethers.utils.Interface(L1BridgeAbi);
  const l2BridgeI = new ethers.utils.Interface(L2BridgeAbi);
  const swapRouterI = new ethers.utils.Interface(SwapRouterAbi.abi);
  const erc20I = new ethers.utils.Interface(ERC20Abi.abi);
  const swapperI = new ethers.utils.Interface(SwapperAbi.abi);

  return { l1BridgeI, l2BridgeI, swapRouterI, erc20I, swapperI };
};

// const getArgs = (txSort: TxSort, logs: Log<bigint, number>[]) => {
//   const { l1BridgeI, l2BridgeI, routerI, erc20I, swapperI } = getInterface();
//   const args = () => {
//     switch (txSort) {
//       //uniswap
//       case "Add Liquidity":
//         return;
//       case "Remove Liquidity":
//         return;
//       case "Swap":
//         return;
//       case "Collect Fee":
//         return;
//       //bridge
//       case "Deposit":
//         return;
//       case "Withdraw":
//         return;
//       case "Wrap":
//         const result = swapperI.parseLog(logs[logs.length - 1]);
//         const { args } = result;
//         return args;
//       case "Unwrap":
//         return;
//       case "Approve":
//         return;
//     }
//   };
//   return args;
// };

export function useTransaction() {
  const [txData] = useRecoilState(txDataStatus);

  const pendingTransactionToApprove = useMemo(() => {
    if (txData)
      return Object.entries(txData).filter(([key, value]) => {
        return (
          value.txSort === "Approve" && value.transactionHash === undefined
        );
      });
  }, [txData]);

  const pendingTransaction = useMemo(() => {
    if (txData)
      return Object.entries(txData).filter(([key, value]) => {
        return value.transactionHash === undefined;
      });
  }, [txData]);

  return {
    allTransaction: txData,
    pendingTransaction,
    pendingTransactionToApprove,
  };
}

export function useTx(params: {
  hash: `0x${string}` | undefined;
  txSort: TxSort;
  tokenAddress?: `0x${string}`;
}) {
  const { hash, txSort, tokenAddress } = params;
  const { isLoading, isSuccess, isError, data } = useWaitForTransaction({
    hash,
  });
  const [txData, setTxData] = useRecoilState(txDataStatus);
  const { connectedChainId } = useConnectedNetwork();

  useEffect(() => {
    if (isLoading && connectedChainId && hash) {
      return setTxData({
        ...txData,
        [hash]: {
          transactionHash: undefined,
          txSort,
          transactionState: undefined,
          tokenData: undefined,
          network: connectedChainId,
          isToasted: false,
        },
      });
    }
  }, [isLoading, hash]);

  useEffect(() => {
    if (isSuccess && data && connectedChainId && hash) {
      const { logs, transactionHash } = data;

      const { l1BridgeI, l2BridgeI, swapRouterI, erc20I, swapperI } =
        getInterface();
      switch (txSort) {
        //Uniswap
        case "Add Liquidity":
          return;
        case "Remove Liquidity":
          return;
        case "Swap": {
          const result = swapRouterI.parseLog(logs[logs.length - 1]);
          const { args } = result;
          return;
        }
        case "Collect Fee":
          return;
        //bridge
        case "Deposit": {
          const result = l1BridgeI.parseLog(logs[logs.length - 1]);
          const { args } = result;
          const { _l1Token, _l2Token, _amount } = args;

          return setTxData({
            ...txData,
            [hash]: {
              transactionHash,
              txSort,
              transactionState: "success",
              tokenData: [
                {
                  tokenAddress: _l1Token,
                  amount: _amount,
                },
                {
                  tokenAddress: _l2Token,
                  amount: _amount,
                },
              ],
              network: connectedChainId,
              isToasted: false,
            },
          });
        }

        case "Withdraw": {
          const result = l2BridgeI.parseLog(logs[logs.length - 1]);
          const { args } = result;
          const { _l1Token, _l2Token, _amount } = args;

          return setTxData({
            ...txData,
            [hash]: {
              transactionHash,
              txSort,
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
              isToasted: false,
            },
          });
        }
        //wrap
        case "Wrap": {
          const result = swapperI.parseLog(logs[logs.length - 1]);
          const { args } = result;
          return setTxData({
            ...txData,
            [hash]: {
              transactionHash,
              txSort,
              transactionState: "success",
              tokenData: [
                {
                  tokenAddress: tokenAddress ?? "0x",
                  amount: args.amount.toBigInt(),
                },
              ],
              network: connectedChainId,
              isToasted: false,
            },
          });
        }
        case "Unwrap": {
          const result = swapperI.parseLog(logs[logs.length - 1]);
          const { args } = result;
          return setTxData({
            ...txData,
            [hash]: {
              transactionHash,
              txSort,
              transactionState: "success",
              tokenData: [
                {
                  tokenAddress: tokenAddress ?? "0x",
                  amount: args.amount.toBigInt(),
                },
              ],
              network: connectedChainId,
              isToasted: false,
            },
          });
        }
        //etc
        case "Approve":
          const result = erc20I.parseLog(logs[logs.length - 1]);
          const { args } = result;
          return setTxData({
            ...txData,
            [hash]: {
              transactionHash,
              txSort,
              transactionState: "success",
              tokenData: [
                {
                  tokenAddress: tokenAddress ?? "0x",
                  amount: args.value.toBigInt(),
                },
              ],
              network: connectedChainId,
              isToasted: false,
            },
          });
        default:
          break;
      }
    }
    if (isError && data && connectedChainId && hash) {
    }
  }, [isSuccess, isError, txSort, data, connectedChainId, hash, tokenAddress]);

  return {};
}
