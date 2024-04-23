import { TxSort, ActionSort } from "@/types/tx/txType";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useWaitForTransaction } from "wagmi";
import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import ERC20Abi from "@/abis/erc20.json";
import SwapperAbi from "@/abis/SwapperV2.json";
import UniswapV3PoolAbi from "@/abis/IUniswapV3Pool.json";
import NONFUNGIBLE_POSITION_MANAGER_ABI from "@/abis/NONFUNGIBLE_POSITION_MANAGER_ABI.json";
import L1CrossDomainMessengerAbi from "constant/abis/L1CrossDomainMessenger.json";
import WethABi from "constant/abis/WETH.json";
import UniswapV3Pool from "constant/abis/IUniswapV3Pool.json";

import { useRecoilState } from "recoil";
import {
  txDataStatus,
  txHashLog,
  txHashStatus,
  txPendingStatus,
} from "@/recoil/global/transaction";
import useConnectedNetwork from "../network";
import { useTONAddress } from "../token/useTonConctrac";
import { transactionModalStatus } from "@/recoil/modal/atom";
import { selectedInTokenStatus } from "@/recoil/bridgeSwap/atom";
import useMediaView from "../mediaView/useMediaView";
import {
  TON_ADDRESS_BY_CHAINID,
  WETH_ADDRESS_BY_CHAINID,
  WTON_ADDRESS_BY_CHAINID,
} from "@/constant/contracts/tokens";
import { Log } from "viem";

const getInterface = () => {
  const l1BridgeI = new ethers.utils.Interface(L1BridgeAbi);
  const l2BridgeI = new ethers.utils.Interface(L2BridgeAbi);
  const swapRouterI = new ethers.utils.Interface(UniswapV3PoolAbi);
  const erc20I = new ethers.utils.Interface(ERC20Abi.abi);
  const swapperI = new ethers.utils.Interface(SwapperAbi.abi);
  const nonFungiblePositionManagerI = new ethers.utils.Interface(
    NONFUNGIBLE_POSITION_MANAGER_ABI
  );
  const UniswapV3PoolI = new ethers.utils.Interface(UniswapV3Pool);

  const L1CrossDomainMessengerI = new ethers.utils.Interface(
    L1CrossDomainMessengerAbi
  );
  const ETHSwapperI = new ethers.utils.Interface(WethABi);

  return {
    l1BridgeI,
    l2BridgeI,
    swapRouterI,
    erc20I,
    swapperI,
    nonFungiblePositionManagerI,
    UniswapV3PoolI,
    L1CrossDomainMessengerI,
    ETHSwapperI,
  };
};

const getEventSignature = () => {
  return {
    deposit: ethers.utils.id("Deposit(address,address,uint256)"),
    withdraw: ethers.utils.id("Withdraw(address,address,uint256)"),
    wrap: ethers.utils.id("Wrap(address,uint256)"),
    unwrap: ethers.utils.id("Unwrap(address,uint256)"),
    approve: ethers.utils.id("Approval(address,address,uint256)"),
    addLiquidity: ethers.utils.id(
      "IncreaseLiquidity(uint256,uint128,uint256,uint256)"
    ),
    increaseLiquidity: ethers.utils.id(
      "IncreaseLiquidity(uint256,uint128,uint256,uint256)"
    ),
    removeLiquidity: ethers.utils.id(
      "Collect(uint256,address,uint256,uint256)"
    ),
  };
};

const getEvent = (logs: Log<bigint, number>[], txSort: TxSort) => {
  const eventSignature = getEventSignature();
  switch (txSort) {
    case "Add Liquidity":
      return logs.filter((log) => {
        return log.topics[0] === eventSignature.addLiquidity;
      });
    case "Increase Liquidity":
      return logs.filter((log) => {
        return log.topics[0] === eventSignature.increaseLiquidity;
      });
    case "Remove Liquidity":
      return logs.filter((log) => {
        return log.topics[0] === eventSignature.removeLiquidity;
      });
    case "Collect Fee":
      return logs.filter((log) => {
        return log.topics[0] === eventSignature.removeLiquidity;
      });
    default:
      return undefined;
  }
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
      return Object.entries(txData).filter(([, value]) => {
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

  const confirmedApproveTransaction = useMemo(() => {
    if (txData) {
      const filteredData = Object.entries(txData).filter(([, value]) => {
        return (
          value.txSort === "Approve" && value.transactionState === "success"
        );
      })[0];
      if (filteredData && filteredData[1]) {
        return filteredData[1];
      }
    }
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
    confirmedApproveTransaction,
  };
}

export function useTx(params: {
  hash: `0x${string}` | undefined;
  txSort: TxSort;
  tokenAddress?: `0x${string}`;
  tokenOutAddress?: `0x${string}`;
  actionSort?: ActionSort;
}) {
  const { hash, txSort, tokenAddress, tokenOutAddress, actionSort } = params;

  const { connectedChainId } = useConnectedNetwork();

  const { isLoading, isSuccess, isError, data } = useWaitForTransaction({
    hash,
    chainId: connectedChainId,
  });

  const [, setTxData] = useRecoilState(txDataStatus);
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const [, setModalOpen] = useRecoilState(transactionModalStatus);

  const [, setTxPending] = useRecoilState(txPendingStatus);
  const [, setTxHash] = useRecoilState(txHashStatus);
  const [, setTxLog] = useRecoilState(txHashLog);

  useEffect(() => {
    if (isLoading && !isError) {
      return setTxPending(true);
    }
    return setTxPending(false);
  }, [isLoading, connectedChainId, isError]);

  useEffect(() => {
    if (isSuccess) {
      return setModalOpen("confirmed");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setTxPending(false);
      return setModalOpen("error");
    }
  }, [isError]);

  useEffect(() => {
    if (data?.transactionHash) return setTxHash(data.transactionHash);
  }, [data]);

  useEffect(() => {
    if (hash === undefined) return setTxPending(false);
  }, [hash]);

  //initialize txData when chainId is changed
  useEffect(() => {
    setTxData(undefined);
  }, [connectedChainId]);

  useEffect(() => {
    try {
      if (isError) {
        return;
      }
      if (
        data &&
        (txSort === "Add Liquidity" ||
          txSort === "Increase Liquidity" ||
          txSort === "Remove Liquidity")
      ) {
        const { logs, transactionHash } = data;
        const { nonFungiblePositionManagerI } = getInterface();

        const result = nonFungiblePositionManagerI.parseLog(
          logs[logs.length - 1]
        );
        const { args } = result;
        setTxLog({
          txSort,
          logs: args,
        });
      }
    } catch (e) {
      console.log("**nonFungiblePositionManagerI.parseLog**");
      console.log(e);
    }
  }, [isSuccess, isError, txSort, data, hash]);

  useEffect(() => {
    if (isLoading && connectedChainId && hash) {
      if (selectedInToken && txSort !== "Approve") {
        setSelectedInToken({
          ...selectedInToken,
          amountBN: null,
          parsedAmount: null,
        });
      }

      return setTxData({
        [hash]: {
          transactionHash: undefined,
          txSort,
          transactionState: undefined,
          tokenData: undefined,
          network: connectedChainId,
          isToasted: false,
          actionSort,
        },
      });
    }
  }, [isLoading, hash, connectedChainId, txSort, actionSort]);

  useEffect(() => {
    if (isSuccess && data && connectedChainId && hash) {
      const { logs, transactionHash } = data;
      const {
        l1BridgeI,
        l2BridgeI,
        swapRouterI,
        erc20I,
        swapperI,
        nonFungiblePositionManagerI,
        ETHSwapperI,
      } = getInterface();
      setModalOpen("confirmed");

      switch (txSort) {
        //Uniswap
        case "Add Liquidity":
          {
            const event = getEvent(logs, txSort);
            if (event === undefined || event.length === 0) {
              return;
            }
            const result = nonFungiblePositionManagerI.parseLog(event[0]);
            const { args } = result;
            const { amount0, amount1 } = args;

            setTxData({
              [hash]: {
                transactionHash,
                txSort,
                transactionState: "success",
                tokenData: [
                  {
                    tokenAddress: tokenAddress ?? "0x",
                    amount: amount0.toBigInt(),
                  },
                  {
                    tokenAddress: tokenOutAddress ?? "0x",
                    amount: amount1.toBigInt(),
                  },
                ],
                network: connectedChainId,
                isToasted: false,
                actionSort,
              },
            });
          }
          return;
        case "Increase Liquidity": {
          {
            const event = getEvent(logs, txSort);
            if (event === undefined || event.length === 0) {
              return;
            }
            const result = nonFungiblePositionManagerI.parseLog(event[0]);
            const { args } = result;
            const { amount0, amount1 } = args;

            setTxData({
              [hash]: {
                transactionHash,
                txSort,
                transactionState: "success",
                tokenData: [
                  {
                    tokenAddress: tokenAddress ?? "0x",
                    amount: amount0.toBigInt(),
                  },
                  {
                    tokenAddress: tokenOutAddress ?? "0x",
                    amount: amount1.toBigInt(),
                  },
                ],
                network: connectedChainId,
                isToasted: false,
                actionSort,
              },
            });
          }
          return;
        }
        case "Remove Liquidity":
          {
            const event = getEvent(logs, txSort);
            if (event === undefined || event.length === 0) {
              return;
            }

            const result = nonFungiblePositionManagerI.parseLog(event[0]);
            const { args } = result;
            const { amount0, amount1 } = args;

            setTxData({
              [hash]: {
                transactionHash,
                txSort,
                transactionState: "success",
                tokenData: [
                  {
                    tokenAddress: tokenAddress ?? "0x",
                    amount: amount0.toBigInt(),
                  },
                  {
                    tokenAddress: tokenOutAddress ?? "0x",
                    amount: amount1.toBigInt(),
                  },
                ],
                network: connectedChainId,
                isToasted: false,
                actionSort,
              },
            });
          }

          return;
        case "Swap": {
          try {
            const result = swapRouterI.parseLog(logs[logs.length - 1]);
            let trasferedOutResult;
            try {
              trasferedOutResult = erc20I.parseLog(logs[1]);
            } catch (e) {
              trasferedOutResult = erc20I.parseLog(logs[2]);
            }
            // const transferedInResult = erc20I.parseLog(logs[4]);

            const { args } = result;
            const { amount0, amount1 } = args;
            const transferedValue = trasferedOutResult.args.value;
            // const transferedInValue = transferedInResult.args.value;

            setTxData({
              [hash]: {
                transactionHash,
                txSort,
                transactionState: "success",
                tokenData: [
                  {
                    tokenAddress: tokenAddress ?? "0x",
                    amount: transferedValue.toBigInt(),
                  },
                  {
                    tokenAddress: tokenOutAddress ?? "0x",
                    amount: amount1.toBigInt(),
                  },
                ],
                network: connectedChainId,
                isToasted: false,
                actionSort,
              },
            });
          } catch (e) {}
        }

        case "Collect Fee":
          {
            const event = getEvent(logs, txSort);
            if (event === undefined || event.length === 0) {
              return;
            }
            const result = nonFungiblePositionManagerI.parseLog(event[0]);
            const { args } = result;
            const { amount0, amount1 } = args;

            setTxData({
              [hash]: {
                transactionHash,
                txSort,
                transactionState: "success",
                tokenData: [
                  {
                    tokenAddress: tokenAddress ?? "0x",
                    amount: amount0.toBigInt(),
                  },
                  {
                    tokenAddress: tokenOutAddress ?? "0x",
                    amount: amount1.toBigInt(),
                  },
                ],
                network: connectedChainId,
                isToasted: false,
                actionSort,
              },
            });
          }
          return;
        //bridge
        case "Deposit": {
          const result = l1BridgeI.parseLog(logs[logs.length - 1]);
          const { args } = result;
          const { _l1Token, _l2Token, _amount } = args;

          if (_l1Token === undefined) {
            return setTxData({
              [hash]: {
                transactionHash,
                txSort,
                transactionState: "success",
                tokenData: [
                  {
                    tokenAddress: "ETH",
                    amount: _amount,
                  },
                  {
                    tokenAddress: "ETH",
                    amount: _amount,
                  },
                ],
                network: connectedChainId,
                isToasted: false,
                actionSort,
              },
            });
          }

          return setTxData({
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
                  tokenAddress: _l1Token,
                  amount: _amount,
                },
              ],
              network: connectedChainId,
              isToasted: false,
              actionSort,
            },
          });
        }

        case "Withdraw": {
          const result = l2BridgeI.parseLog(logs[logs.length - 1]);
          const { args } = result;
          const { _l1Token, _l2Token, _amount } = args;

          return setTxData({
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
                  tokenAddress: _l2Token,
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
          const WTON_ADDRESS = WTON_ADDRESS_BY_CHAINID[connectedChainId];
          return setTxData({
            [hash]: {
              transactionHash,
              txSort,
              transactionState: "success",
              tokenData: [
                {
                  tokenAddress: tokenAddress ?? "0x",
                  amount: args.amount.toBigInt(),
                },
                {
                  tokenAddress: WTON_ADDRESS ?? "0x",
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
          const TON_ADDRESS = TON_ADDRESS_BY_CHAINID[connectedChainId];
          return setTxData({
            [hash]: {
              transactionHash,
              txSort,
              transactionState: "success",
              tokenData: [
                {
                  tokenAddress: tokenAddress ?? "0x",
                  amount: args.amount.toBigInt(),
                },
                {
                  tokenAddress: TON_ADDRESS,
                  amount: args.amount.toBigInt(),
                },
              ],
              network: connectedChainId,
              isToasted: false,
            },
          });
        }

        case "ETH-Wrap": {
          const result = ETHSwapperI.parseLog(logs[logs.length - 1]);
          const { args } = result;
          const WETH_ADDRESS = WETH_ADDRESS_BY_CHAINID[connectedChainId];
          return setTxData({
            [hash]: {
              transactionHash,
              txSort,
              transactionState: "success",
              tokenData: [
                {
                  tokenAddress: "ETH",
                  amount: args.wad.toBigInt(),
                },
                {
                  tokenAddress: WETH_ADDRESS,
                  amount: args.wad.toBigInt(),
                },
              ],
              network: connectedChainId,
              isToasted: false,
            },
          });
        }

        case "ETH-Unwrap": {
          const result = ETHSwapperI.parseLog(logs[logs.length - 1]);
          const { args } = result;
          const WETH_ADDRESS = WETH_ADDRESS_BY_CHAINID[connectedChainId];
          return setTxData({
            [hash]: {
              transactionHash,
              txSort,
              transactionState: "success",
              tokenData: [
                {
                  tokenAddress: WETH_ADDRESS,
                  amount: args.wad.toBigInt(),
                },
                {
                  tokenAddress: "ETH",
                  amount: args.wad.toBigInt(),
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
              actionSort,
            },
          });
        default:
          break;
      }
    }
    if (isError && data && connectedChainId && hash) {
      console.log(isError, hash);
      setModalOpen("error");
    }
  }, [isSuccess, isError, txSort, data, tokenAddress, hash]);

  return { isLoading };
}
