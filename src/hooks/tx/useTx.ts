import { TxSort } from "@/types/tx/txType";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useWaitForTransaction } from "wagmi";
import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import ERC20Abi from "@/abis/erc20.json";
import SwapperAbi from "@/abis/SwapperV2.json";
import UniswapV3PoolAbi from "@/abis/IUniswapV3Pool.json";
import L1CrossDomainMessengerAbi from "constant/abis/L1CrossDomainMessenger.json";

import { useTransaction as useTrasactionW } from "wagmi";
import { useRecoilState } from "recoil";
import {
  txDataStatus,
  txHashStatus,
  txPendingStatus,
} from "@/recoil/global/transaction";
import useConnectedNetwork from "../network";
import { useTONAddress } from "../token/useTonConctrac";
import { transactionModalStatus } from "@/recoil/modal/atom";
import { selectedInTokenStatus } from "@/recoil/bridgeSwap/atom";
import useTxConfirmModal from "../modal/useTxConfirmModal";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { accountDrawerStatus } from "@/recoil/modal/atom";
const getInterface = () => {
  const l1BridgeI = new ethers.utils.Interface(L1BridgeAbi);
  const l2BridgeI = new ethers.utils.Interface(L2BridgeAbi);
  const swapRouterI = new ethers.utils.Interface(UniswapV3PoolAbi);
  const erc20I = new ethers.utils.Interface(ERC20Abi.abi);
  const swapperI = new ethers.utils.Interface(SwapperAbi.abi);
  const L1CrossDomainMessengerI = new ethers.utils.Interface(
    L1CrossDomainMessengerAbi
  );
  return {
    l1BridgeI,
    l2BridgeI,
    swapRouterI,
    erc20I,
    swapperI,
    L1CrossDomainMessengerI,
  };
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
  const [txData, setTxData] = useRecoilState(txDataStatus);
  const { connectedChainId } = useConnectedNetwork();

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
      return Object.entries(txData).filter(([, value]) => {
        return value.transactionHash === undefined;
      });
    return undefined;
  }, [txData]);

  const {
    data: txCheckData,
    isError: txCheckError,
    error,
  } = useTrasactionW({
    hash:
      pendingTransaction !== undefined &&
      pendingTransaction !== null &&
      pendingTransaction.length === 1
        ? (pendingTransaction[0][0] as `0x${string}`)
        : "0x",
  });

  // useEffect(() => {
  //   if (pendingTransaction?.length === 1) {
  //     if (txCheckError && error) return setTxData(undefined);
  //   }
  // }, [txCheckData, txCheckError, error, pendingTransaction]);

  const isPending = useMemo(() => {
    if (pendingTransaction && pendingTransaction.length > 0) {
      return true;
    }
    return false;
  }, [pendingTransaction, txData]);

  const confirmedTransaction = useMemo(() => {
    if (txData)
      return Object.entries(txData).filter(([, value]) => {
        return value.transactionHash !== undefined ? value : undefined;
      });
  }, [txData]);

  useEffect(() => {
    setTxData(undefined);
  }, [connectedChainId]);

  return {
    allTransaction: txData,
    pendingTransaction,
    isPending,
    pendingTransactionToApprove,
    confirmedTransaction,
  };
}

export function useTx(params: {
  hash: `0x${string}` | undefined;
  txSort: TxSort;
  tokenAddress?: `0x${string}`;
  tokenOutAddress?: `0x${string}`;
}) {
  const { hash, txSort, tokenAddress, tokenOutAddress } = params;

  const { isLoading, isSuccess, isError, data } = useWaitForTransaction({
    hash,
  });
  const [txData, setTxData] = useRecoilState(txDataStatus);
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const { connectedChainId } = useConnectedNetwork();
  const { TON_ADDRESS, WTON_ADDRESS } = useTONAddress();
  const [, setModalOpen] = useRecoilState(transactionModalStatus);
  const [, setIsAccountDrawerOpen] = useRecoilState(accountDrawerStatus);

  const [, setTxPending] = useRecoilState(txPendingStatus);
  const [, setTxHash] = useRecoilState(txHashStatus);
  const { mode } = useGetMode();

  useEffect(() => {
    if (isLoading) {
      return setTxPending(true);
    }

    return setTxPending(false);
  }, [isLoading]);

  useEffect(() => {
    if (isSuccess) {
      if (mode === "Deposit" || mode === "Withdraw") {
        setIsAccountDrawerOpen(true);
      }
      return setModalOpen("confirmed");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) return setModalOpen("error");
  }, [isError]);

  useEffect(() => {
    if (data?.transactionHash) return setTxHash(data.transactionHash);
  }, [data]);

  // useEffect(() => {
  //   if (isLoading && connectedChainId && hash) {
  //     if (selectedInToken) {
  //       setSelectedInToken({
  //         ...selectedInToken,
  //         amountBN: null,
  //         parsedAmount: null,
  //       });
  //     }

  //     return setTxData({
  //       ...txData,
  //       [hash]: {
  //         transactionHash: undefined,
  //         txSort,
  //         transactionState: undefined,
  //         tokenData: undefined,
  //         network: connectedChainId,
  //         isToasted: false,
  //       },
  //     });
  //   }
  // }, [isLoading, hash, connectedChainId]);

  // useEffect(() => {
  //   if (isSuccess && data && connectedChainId && hash) {
  //     const { logs, transactionHash } = data;
  //     const { l1BridgeI, l2BridgeI, swapRouterI, erc20I, swapperI } =
  //       getInterface();
  //     setModalOpen("confirmed");
  //     switch (txSort) {
  //       //Uniswap
  //       case "Add Liquidity":
  //         return;
  //       case "Remove Liquidity":
  //         return;
  //       case "Swap": {
  //         try {
  //           const result = swapRouterI.parseLog(logs[logs.length - 1]);
  //           let trasferedOutResult;
  //           try {
  //             trasferedOutResult = erc20I.parseLog(logs[1]);
  //           } catch (e) {
  //             trasferedOutResult = erc20I.parseLog(logs[2]);
  //           }
  //           // const transferedInResult = erc20I.parseLog(logs[4]);

  //           const { args } = result;
  //           const { amount0, amount1 } = args;
  //           const transferedValue = trasferedOutResult.args.value;
  //           // const transferedInValue = transferedInResult.args.value;

  //           setTxData({
  //             ...txData,
  //             [hash]: {
  //               transactionHash,
  //               txSort,
  //               transactionState: "success",
  //               tokenData: [
  //                 {
  //                   tokenAddress: tokenAddress ?? "0x",
  //                   amount: transferedValue.toBigInt(),
  //                 },
  //                 {
  //                   tokenAddress: tokenOutAddress ?? "0x",
  //                   amount: amount1.toBigInt(),
  //                 },
  //               ],
  //               network: connectedChainId,
  //               isToasted: false,
  //             },
  //           });
  //         } catch (e) {}
  //       }

  //       case "Collect Fee":
  //         return;
  //       //bridge
  //       case "Deposit": {
  //         const result = l1BridgeI.parseLog(logs[logs.length - 1]);
  //         const { args } = result;
  //         const { _l1Token, _l2Token, _amount } = args;

  //         if (_l1Token === undefined) {
  //           return setTxData({
  //             ...txData,
  //             [hash]: {
  //               transactionHash,
  //               txSort,
  //               transactionState: "success",
  //               tokenData: [
  //                 {
  //                   tokenAddress: "ETH",
  //                   amount: _amount,
  //                 },
  //                 {
  //                   tokenAddress: "ETH",
  //                   amount: _amount,
  //                 },
  //               ],
  //               network: connectedChainId,
  //               isToasted: false,
  //             },
  //           });
  //         }

  //         return setTxData({
  //           ...txData,
  //           [hash]: {
  //             transactionHash,
  //             txSort,
  //             transactionState: "success",
  //             tokenData: [
  //               {
  //                 tokenAddress: _l1Token,
  //                 amount: _amount,
  //               },
  //               {
  //                 tokenAddress: _l1Token,
  //                 amount: _amount,
  //               },
  //             ],
  //             network: connectedChainId,
  //             isToasted: false,
  //           },
  //         });
  //       }

  //       case "Withdraw": {
  //         const result = l2BridgeI.parseLog(logs[logs.length - 1]);
  //         const { args } = result;
  //         const { _l1Token, _l2Token, _amount } = args;

  //         return setTxData({
  //           ...txData,
  //           [hash]: {
  //             transactionHash,
  //             txSort,
  //             transactionState: "success",
  //             tokenData: [
  //               {
  //                 tokenAddress: _l2Token,
  //                 amount: _amount,
  //               },
  //               {
  //                 tokenAddress: _l2Token,
  //                 amount: _amount,
  //               },
  //             ],
  //             network: connectedChainId,
  //             isToasted: false,
  //           },
  //         });
  //       }
  //       //wrap
  //       case "Wrap": {
  //         const result = swapperI.parseLog(logs[logs.length - 1]);
  //         const { args } = result;
  //         return setTxData({
  //           ...txData,
  //           [hash]: {
  //             transactionHash,
  //             txSort,
  //             transactionState: "success",
  //             tokenData: [
  //               {
  //                 tokenAddress: tokenAddress ?? "0x",
  //                 amount: args.amount.toBigInt(),
  //               },
  //               {
  //                 tokenAddress: WTON_ADDRESS ?? "0x",
  //                 amount: args.amount.toBigInt(),
  //               },
  //             ],
  //             network: connectedChainId,
  //             isToasted: false,
  //           },
  //         });
  //       }
  //       case "Unwrap": {
  //         const result = swapperI.parseLog(logs[logs.length - 1]);
  //         const { args } = result;
  //         return setTxData({
  //           ...txData,
  //           [hash]: {
  //             transactionHash,
  //             txSort,
  //             transactionState: "success",
  //             tokenData: [
  //               {
  //                 tokenAddress: tokenAddress ?? "0x",
  //                 amount: args.amount.toBigInt(),
  //               },
  //               {
  //                 tokenAddress: TON_ADDRESS,
  //                 amount: args.amount.toBigInt(),
  //               },
  //             ],
  //             network: connectedChainId,
  //             isToasted: false,
  //           },
  //         });
  //       }
  //       //etc
  //       case "Approve":
  //         const result = erc20I.parseLog(logs[logs.length - 1]);
  //         const { args } = result;
  //         return setTxData({
  //           ...txData,
  //           [hash]: {
  //             transactionHash,
  //             txSort,
  //             transactionState: "success",
  //             tokenData: [
  //               {
  //                 tokenAddress: tokenAddress ?? "0x",
  //                 amount: args.value.toBigInt(),
  //               },
  //             ],
  //             network: connectedChainId,
  //             isToasted: false,
  //           },
  //         });
  //       default:
  //         break;
  //     }
  //   }
  //   if (isError && data && connectedChainId && hash) {
  //     console.log(isError, hash);
  //     setModalOpen("error");
  //   }
  // }, [isSuccess, isError, txSort, data, tokenAddress, hash]);

  return {};
}
