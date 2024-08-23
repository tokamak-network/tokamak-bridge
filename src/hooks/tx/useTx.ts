import { TxSort, ActionSort, ThanosDepositType } from "@/types/tx/txType";
import { ethers } from "ethers";
import { useEffect, useMemo } from "react";
import { useWaitForTransaction } from "wagmi";
import L1TitanBridgeAbi from "@/abis/L1StandardBridge.json";
import L1ThanosBridgeAbi from "@/abis/L1ThanosStandardBridge.json";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import ERC20Abi from "@/abis/erc20.json";
import WTON_ABI from "@/abis/WTON.json";
import UniswapV3PoolAbi from "@/abis/IUniswapV3Pool.json";
import NONFUNGIBLE_POSITION_MANAGER_ABI from "@/abis/NONFUNGIBLE_POSITION_MANAGER_ABI.json";
import L1CrossDomainMessengerAbi from "constant/abis/L1CrossDomainMessenger.json";
import WethABi from "constant/abis/WETH.json";
import UniswapV3Pool from "constant/abis/IUniswapV3Pool.json";
import USDTAbi from "constant/abis/USDT.json";
import { getWETHAddressByChainId } from "@/utils/token/isETH";
import { useRecoilState } from "recoil";
import {
  txDataStatus,
  txHashLog,
  txHashStatus,
  txPendingStatus,
} from "@/recoil/global/transaction";
import useConnectedNetwork from "../network";
import {
  TON_ADDRESS_BY_CHAINID,
  WETH_ADDRESS_BY_CHAINID,
  WTON_ADDRESS_BY_CHAINID,
} from "@/constant/contracts/tokens";
import { Log } from "viem";
import { useGetMode } from "../mode/useGetMode";
import useTxConfirmModal from "../modal/useTxConfirmModal";
import L1CrossTradeAbi from "@/abis/L1CrossTrade.json";
import L2CrossTradeAbi from "@/abis/L2CrossTrade.json";
import {
  SupportedChainId,
  SupportedL2ChainId,
} from "@/types/network/supportedNetwork";
import { L2ChainID } from "@tokamak-network/titan-sdk";

const getInterface = () => {
  const l1TitanBridgeI = new ethers.utils.Interface(L1TitanBridgeAbi);
  const l1ThanosBridgeI = new ethers.utils.Interface(L1ThanosBridgeAbi);
  const l2BridgeI = new ethers.utils.Interface(L2BridgeAbi);
  const swapRouterI = new ethers.utils.Interface(UniswapV3PoolAbi);
  const erc20I = new ethers.utils.Interface(ERC20Abi.abi);
  const USDT_I = new ethers.utils.Interface(USDTAbi);
  const WTON_I = new ethers.utils.Interface(WTON_ABI.abi);
  const nonFungiblePositionManagerI = new ethers.utils.Interface(
    NONFUNGIBLE_POSITION_MANAGER_ABI
  );
  const UniswapV3PoolI = new ethers.utils.Interface(UniswapV3Pool);
  const L1CrossDomainMessengerI = new ethers.utils.Interface(
    L1CrossDomainMessengerAbi
  );
  const ETHSwapperI = new ethers.utils.Interface(WethABi);
  const CrossTradeProxyL1_I = new ethers.utils.Interface(L1CrossTradeAbi.abi);
  const CrossTradeProxyL2_I = new ethers.utils.Interface(L2CrossTradeAbi.abi);

  return {
    l1TitanBridgeI,
    l1ThanosBridgeI,
    l2BridgeI,
    swapRouterI,
    erc20I,
    WTON_I,
    nonFungiblePositionManagerI,
    UniswapV3PoolI,
    L1CrossDomainMessengerI,
    ETHSwapperI,
    USDT_I,
    CrossTradeProxyL1_I,
    CrossTradeProxyL2_I,
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

const getETHWrapEventSignature = () => {
  return ethers.utils.id("Deposit(address,uint256)");
};
const getWETHUnwrapEventSignature = () => {
  return ethers.utils.id("Withdrawal(address,uint256)");
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
    case "Approve" || "Revoke":
      return logs.filter((log) => {
        return log.topics[0] === eventSignature.approve;
      });
    default:
      return undefined;
  }
};

const getETHWrapEvent = (logs: Log<bigint, number>[]) => {
  const eventSignature = getETHWrapEventSignature();
  return (
    logs.filter((log) => {
      return log.topics[0] === eventSignature;
    }).length > 0
  );
};

const getWETHUnwrapEvent = (logs: Log<bigint, number>[]) => {
  const eventSignature = getWETHUnwrapEventSignature();
  return (
    logs.filter((log) => {
      return log.topics[0] === eventSignature;
    }).length > 0
  );
};

const getTokenAddress = (
  tokenAddress: `0x${string}` | undefined,
  chainId: number,
  isETH: boolean
) => {
  const WETHAddress = getWETHAddressByChainId(chainId);
  return isETH && WETHAddress === tokenAddress ? "ETH" : tokenAddress ?? "0x";
};

export function useTransaction() {
  const [txData] = useRecoilState(txDataStatus);

  const pendingTransactionToApprove = useMemo(() => {
    if (txData)
      return Object.entries(txData).filter(([, value]) => {
        return (
          (value.txSort === "Approve" || value.txSort === "Revoke") &&
          value.transactionHash === undefined
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

  const confirmedRevokeTransaction = useMemo(() => {
    if (txData) {
      const filteredData = Object.entries(txData).filter(([, value]) => {
        return (
          value.txSort === "Revoke" && value.transactionState === "success"
        );
      })[0];
      if (filteredData && filteredData[1]) {
        return filteredData[1];
      }
    }
  }, [txData]);

  // useEffect(() => {
  //   setTxData(undefined);
  // }, [connectedChainId]);

  return {
    allTransaction: txData,
    pendingTransaction,
    isPending,
    pendingTransactionToApprove,
    confirmedTransaction,
    confirmedApproveTransaction,
    confirmedRevokeTransaction,
  };
}

export function useTx(params: {
  hash: `0x${string}` | undefined;
  txSort: TxSort;
  tokenAddress?: `0x${string}`;
  tokenOutAddress?: `0x${string}`;
  actionSort?: ActionSort;
  L2Chain?: SupportedL2ChainId;
}) {
  const { hash, txSort, tokenAddress, tokenOutAddress, actionSort, L2Chain } =
    params;
  const { connectedChainId, layer } = useConnectedNetwork();
  const { data, isLoading, isSuccess, isError } = useWaitForTransaction({
    hash,
    chainId: connectedChainId,
  });

  const { mode, subMode } = useGetMode();
  const [, setTxData] = useRecoilState(txDataStatus);
  const [, setTxPending] = useRecoilState(txPendingStatus);
  const [, setTxHash] = useRecoilState(txHashStatus);
  const [, setTxLog] = useRecoilState(txHashLog);
  const { setModalOpen } = useTxConfirmModal();

  useEffect(() => {
    if (isLoading && !isError) {
      return setTxPending(true);
    }
    return setTxPending(false);
  }, [isLoading, connectedChainId, isError]);

  const { confirmedTransaction } = useTransaction();

  useEffect(() => {
    //@ts-ignore
    if (isSuccess && confirmedTransaction?.includes(hash as string)) {
      if (mode === "Pool" && layer === "L2") {
        const delayTime = subMode.add ? 4000 : 2000;
        setTimeout(() => {
          return setModalOpen("confirmed");
        }, delayTime);
      }
      return setModalOpen("confirmed");
    }
  }, [isSuccess, layer, mode, subMode, confirmedTransaction, hash]);

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
        const { logs } = data;
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
        l1TitanBridgeI,
        l1ThanosBridgeI,
        l2BridgeI,
        swapRouterI,
        erc20I,
        WTON_I,
        nonFungiblePositionManagerI,
        ETHSwapperI,
        CrossTradeProxyL1_I,
        CrossTradeProxyL2_I,
      } = getInterface();
      setModalOpen("confirmed");

      switch (txSort) {
        case "Add Liquidity":
          {
            const event = getEvent(logs, txSort);
            if (event === undefined || event.length === 0) {
              return;
            }
            const result = nonFungiblePositionManagerI.parseLog(event[0]);
            const { args } = result;
            const { amount0, amount1 } = args;
            const isETH = getETHWrapEvent(logs);

            setTxData({
              [hash]: {
                transactionHash,
                txSort,
                transactionState: "success",
                tokenData: [
                  {
                    tokenAddress: getTokenAddress(
                      tokenAddress,
                      connectedChainId,
                      isETH
                    ),
                    amount: amount0.toBigInt(),
                  },
                  {
                    tokenAddress: getTokenAddress(
                      tokenOutAddress,
                      connectedChainId,
                      isETH
                    ),
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
            const isETH = getETHWrapEvent(logs);

            setTxData({
              [hash]: {
                transactionHash,
                txSort,
                transactionState: "success",
                tokenData: [
                  {
                    tokenAddress: getTokenAddress(
                      tokenAddress,
                      connectedChainId,
                      isETH
                    ),
                    amount: amount0.toBigInt(),
                  },
                  {
                    tokenAddress: getTokenAddress(
                      tokenOutAddress,
                      connectedChainId,
                      isETH
                    ),
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
            const isETH = getWETHUnwrapEvent(logs);

            setTxData({
              [hash]: {
                transactionHash,
                txSort,
                transactionState: "success",
                tokenData: [
                  {
                    tokenAddress: getTokenAddress(
                      tokenAddress,
                      connectedChainId,
                      isETH
                    ),
                    amount: amount0.toBigInt(),
                  },
                  {
                    tokenAddress: getTokenAddress(
                      tokenOutAddress,
                      connectedChainId,
                      isETH
                    ),
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
            const isETH = getETHWrapEvent(logs);
            const isWETH = getWETHUnwrapEvent(logs);

            setTxData({
              [hash]: {
                transactionHash,
                txSort,
                transactionState: "success",
                tokenData: [
                  {
                    tokenAddress: getTokenAddress(
                      tokenAddress,
                      connectedChainId,
                      isETH || isWETH
                    ),
                    amount: transferedValue.toBigInt(),
                  },
                  {
                    tokenAddress: getTokenAddress(
                      tokenOutAddress,
                      connectedChainId,
                      isETH || isWETH
                    ),
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
            const isETH = getWETHUnwrapEvent(logs);

            setTxData({
              [hash]: {
                transactionHash,
                txSort,
                transactionState: "success",
                tokenData: [
                  {
                    tokenAddress: getTokenAddress(
                      tokenAddress,
                      connectedChainId,
                      isETH
                    ),
                    amount: amount0.toBigInt(),
                  },
                  {
                    tokenAddress: getTokenAddress(
                      tokenOutAddress,
                      connectedChainId,
                      isETH
                    ),
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
          if (
            L2Chain === SupportedL2ChainId.TITAN ||
            L2Chain === SupportedL2ChainId.TITAN_SEPOLIA
          ) {
            const result = l1TitanBridgeI.parseLog(logs[logs.length - 1]);
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
          } else if (L2Chain === SupportedL2ChainId.THANOS_SEPOLIA) {
            const depositType: ThanosDepositType =
              logs.length === 5
                ? "ETH"
                : logs.length === 13
                ? "NativeToken"
                : "ERC20";

            const result = l1ThanosBridgeI.parseLog(
              depositType === "NativeToken"
                ? logs[3]
                : depositType === "ETH"
                ? logs[0]
                : logs[1]
            );
            const { args } = result;
            const { l1Token, l2Token, amount } = args;
            const L2TokenAddress = depositType === "ETH" ? "ETH" : l1Token;
            return setTxData({
              [hash]: {
                transactionHash,
                txSort,
                transactionState: "success",
                tokenData: [
                  {
                    tokenAddress: L2TokenAddress,
                    amount: amount,
                  },
                  {
                    tokenAddress: L2TokenAddress,
                    amount: amount,
                  },
                ],
                network: connectedChainId,
                isToasted: false,
                actionSort,
                L2Chain,
              },
            });
          }
          return;
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
          const result = WTON_I.parseLog(logs[logs.length - 2]);
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
                  amount: args.value.toBigInt(),
                },
                {
                  tokenAddress: WTON_ADDRESS ?? "0x",
                  amount: args.value.toBigInt(),
                },
              ],
              network: connectedChainId,
              isToasted: false,
            },
          });
        }
        case "Unwrap": {
          const result = WTON_I.parseLog(logs[logs.length - 2]);
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
                  amount: args.value.toBigInt(),
                },
                {
                  tokenAddress: TON_ADDRESS,
                  amount: args.value.toBigInt(),
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

        //CrossTrade
        case "Request": {
          const result = CrossTradeProxyL2_I.parseLog(logs[logs.length - 1]);
          console.log(result);
          const { args } = result;
          const { _l1token, _l2token, _totalAmount, _ctAmount, _amount } = args;

          return setTxData({
            [hash]: {
              transactionHash,
              txSort,
              transactionState: "success",
              tokenData: [
                {
                  tokenAddress: _l2token,
                  amount: _totalAmount,
                },
                {
                  tokenAddress: _l2token,
                  amount: _ctAmount,
                },
              ],
              network: connectedChainId,
              outNetwork: SupportedChainId.MAINNET,
              isToasted: false,
              actionSort: "Cross Trade",
            },
          });
        }

        case "Provide": {
          const result = CrossTradeProxyL1_I.parseLog(logs[logs.length - 1]);
          console.log(result);
          const { args } = result;
          const { _l1token, _l2token, _totalAmount, _ctAmount } = args;

          return setTxData({
            [hash]: {
              transactionHash,
              txSort,
              transactionState: "success",
              tokenData: [
                {
                  tokenAddress: _l1token,
                  amount: _ctAmount,
                },
                {
                  tokenAddress: _l1token,
                  amount: _totalAmount,
                },
              ],
              network: connectedChainId,
              outNetwork: SupportedChainId.TITAN,
              isToasted: false,
              actionSort: "Cross Trade",
            },
          });
        }

        case "UpdateFee": {
          const result = CrossTradeProxyL1_I.parseLog(logs[logs.length - 1]);
          console.log(result);
          const { args } = result;
          const { _l1token } = args;

          return setTxData({
            [hash]: {
              transactionHash,
              txSort,
              transactionState: "success",
              tokenData: [
                {
                  tokenAddress: _l1token,
                  amount: BigInt(0),
                },
              ],
              network: connectedChainId,
              isToasted: false,
              actionSort: "Cross Trade",
            },
          });
        }

        case "CancelRequest": {
          const result = CrossTradeProxyL1_I.parseLog(logs[logs.length - 1]);
          console.log(result);
          const { args } = result;
          const { _l1token } = args;

          return setTxData({
            [hash]: {
              transactionHash,
              txSort,
              transactionState: "success",
              tokenData: [
                {
                  tokenAddress: _l1token,
                  amount: BigInt(0),
                },
              ],
              network: connectedChainId,
              isToasted: false,
              actionSort: "Cross Trade",
            },
          });
        }

        //etc
        case "Approve": {
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
        }
        case "Revoke": {
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
        }
        default:
          break;
      }
    }
    if (isError && data && connectedChainId && hash) {
      setModalOpen("error");
    }
  }, [isSuccess, isError, data, tokenAddress, hash]);

  return { isLoading };
}
