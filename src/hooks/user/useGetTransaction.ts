import { useProvier } from "../provider/useProvider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import useConnectedNetwork from "../network";
import { fetchUserTransactions } from "@/components/history/utils/fetchUserTransactions";
import {  ethers } from "ethers";
import useCrosschainMessenger from "./useCrosschainMessenger";
import {
  L1TxType,
  SentMessages,
  EthType,
  Erc20Type,
  UserL2Transaction,
  FullDepTx,
  FullWithTx,
} from "@/types/activity/history";
// @ts-ignore
import * as titanSDK from "@tokamak-network/tokamak-layer2-sdk";
import { userTransactions } from "@/recoil/userHistory/transaction";
import { useRecoilState } from "recoil";

export default function useGetTransaction() {
  const [tDataDeposit, setTDataDeposit] = useState<FullDepTx[]>([]);
  const [tDataWithdraw, setTDataWithdraw] = useState<any[]>([]);
  const { provider, L1Provider, L2Provider } = useProvier();
  const { address } = useAccount();
  const { layer } = useConnectedNetwork();
  const { crossMessenger, crossMessengerTokamak } = useCrosschainMessenger();
  const l2ProSDK = titanSDK.asL2Provider(
    layer === "L2" ? provider : L2Provider
  );
  const l2Pro = layer === "L2" ? provider : L2Provider;
  const l1Pro = layer === "L1" ? provider : L1Provider;

  const [userTxfromSubgraph, setUserTxfromSubgraph] =
    useRecoilState(userTransactions);
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const [withdrawLoading, setWithdrawLoading] = useState<
    "loading" | "present" | "absent"
  >("loading");

  const [depositLoading, setDepositLoading] = useState<
    "loading" | "present" | "absent"
  >("loading");

  // const subgraphData = useMemo(() => {},[])

  useEffect(() => {
    const subgraphData = async () => {
      if (isConnectedToMainNetwork !== undefined && address) {
        const userAllTransactions = await fetchUserTransactions(
          address,
          isConnectedToMainNetwork
        );

        return setUserTxfromSubgraph(userAllTransactions);
      }
    };
    subgraphData();
  }, [address, layer, isConnectedToMainNetwork]);

  const fetchWithdrawTransactions = useCallback(
    async (set: boolean) => {
      if (
        l2ProSDK !== undefined &&
        l1Pro !== undefined &&
        l2Pro !== undefined &&
        crossMessenger !== undefined &&
        crossMessengerTokamak !== undefined &&
        userTxfromSubgraph !== undefined
      ) {
        set &&
          setWithdrawLoading(
            userTxfromSubgraph.formattedWithdraw.length > 0
              ? "loading"
              : "absent"
          );

        const l2WithdrawTxs = await Promise.all(
          userTxfromSubgraph.formattedWithdraw.map(
            async (tx: L1TxType, index: number) => {
              const resolved = await crossMessengerTokamak.toCrossChainMessage(
                tx.transactionHash
              ); //  office node ok

              const currentStatus = await crossMessenger.getMessageStatus(
                resolved
              ); //no office node

              const l2TxReceipt = await l2Pro.getTransactionReceipt(
                tx.transactionHash
              ); //l2 tx receipt

              if (l2TxReceipt.logs[3] !== undefined) {
                const logs = ethers.utils.defaultAbiCoder.decode(
                  ["address", "uint256", "bytes"],
                  l2TxReceipt.logs[3] && l2TxReceipt.logs[3]?.data
                );

                const l1Token = ethers.utils.defaultAbiCoder.decode(
                  ["address"],
                  l2TxReceipt.logs[3] && l2TxReceipt.logs[3]?.topics[1]
                )[0];

                const l2Token = ethers.utils.defaultAbiCoder.decode(
                  ["address"],
                  l2TxReceipt.logs[3] && l2TxReceipt.logs[3]?.topics[2]
                )[0];

                // if currentStatus is 2 then the tx is still in rollup period ( wait 5 mins for rollup).
                //if status is 4, rollup is finish and tx ready for challenge period
                if (
                  (currentStatus === 2 || currentStatus === 3) &&
                  l2TxReceipt !== undefined
                ) {
                  const amnt = BigInt(logs[1]).toString();

                  return {
                    ...tx,
                    l2timeStamp: tx.blockTimestamp,
                    l2txHash: tx.transactionHash,
                    _l1Token: l1Token,
                    _l2Token: l2Token,
                    _amount: amnt,
                    l2TxReceipt: l2TxReceipt,
                    currentStatus: currentStatus,
                    resolved: resolved,
                  };
                } else if (
                  currentStatus === 4 &&
                  l2TxReceipt.blockNumber !== undefined
                ) {
                  const l2BlockNum = await l2Pro.getBlock(
                    l2TxReceipt.blockNumber
                  );

                  // const messageTxIndex = l2TxReceipt.blockNumber - 1;

                  // const stateBatchAppendedEvent =
                  //   await crossMessenger.getStateBatchAppendedEventByTransactionIndex(
                  //     messageTxIndex
                  //   ); // no office node

                  // const bn = stateBatchAppendedEvent.blockNumber;

                  // const block = await l1Pro.getBlock(bn);

                  // const challengePeriod =
                  //   await crossMessenger.getChallengePeriodSeconds(); //office node ok
                  // const timeReadyForRelay = block.timestamp + challengePeriod;

                  const calculatedTimePeriod = isConnectedToMainNetwork
                    ? 11 * 60 + 7 * 24 * 60 * 60
                    : 2 * 60 + 10 + 150;
                  const testPeriod =
                    l2BlockNum.timestamp + calculatedTimePeriod;

                  // const challengePeriod =
                  //   await crossMessengerTokamak.getChallengePeriodSeconds(); //office node ok
                  const timeReadyForRelay = testPeriod;
                  const amnt = BigInt(logs[1]).toString();
                  return {
                    ...tx,
                    l2TxReceipt: l2TxReceipt,
                    l2timeStamp: tx.blockTimestamp,
                    l2txHash: tx.transactionHash,
                    event: "withdraw",
                    _l1Token: l1Token,
                    _l2Token: l2Token,
                    _amount: amnt,
                    timeReadyForRelay: Number(timeReadyForRelay),
                    currentStatus: currentStatus,
                    resolved: resolved,
                  };
                } else {
                  const receipt = await crossMessenger.getMessageReceipt(
                    resolved
                  ); //  no office node
                  if (
                    l2TxReceipt.blockNumber !== undefined &&
                    receipt != null &&
                    receipt.transactionReceipt != null
                  ) {
                    const matchTx = receipt.transactionReceipt.transactionHash;
                    const l1tx =
                      userTxfromSubgraph.formattedL1WithdrawResults.filter(
                        (tx: EthType | Erc20Type) => {
                          return tx.transactionHash === matchTx;
                        }
                      )[0];

                    if (l1tx) {
                      let copy = {
                        ...tx,
                        ...l1tx,
                        l2TxReceipt: l2TxReceipt,
                        l2timeStamp: tx.blockTimestamp,
                        l1timeStamp: l1tx ? l1tx.blockTimestamp : 0,
                        l1Block: l1tx.blockNumber,
                        l2txHash: tx.transactionHash,
                        l1txHash: l1tx.transactionHash,
                        event: "withdraw",
                        _amount: l1tx._amount,
                        _l1Token: l1tx._l1Token,
                        _l2Token: l1tx._l2Token,
                        currentStatus: currentStatus,
                        resolved: resolved,
                      };
                      return copy;
                    }
                  } else {
                    const amnt = BigInt(logs[1]).toString();
                    let copy = {
                      ...tx,
                      l2TxReceipt: l2TxReceipt,
                      l2timeStamp: tx.blockTimestamp,
                      l2txHash: tx.transactionHash,
                      event: "withdraw",
                      _l1Token: l1Token,
                      _l2Token: l2Token,
                      _amount: amnt,
                      currentStatus: currentStatus,
                      resolved: resolved,
                    };
                    return copy;
                  }
                }
              }
            }
          )
        );

        console.log(l2WithdrawTxs);
        const filteredl2WithdrawTxs = l2WithdrawTxs.filter(
          (tx: FullWithTx) => tx !== undefined
        );
        console.log(filteredl2WithdrawTxs);

        const allTxs =
          layer == "L1"
            ? filteredl2WithdrawTxs.sort(
                (tx1: FullWithTx, tx2: FullWithTx) =>
                  Number(tx2.l2timeStamp) - Number(tx1.l2timeStamp)
              )
            : filteredl2WithdrawTxs.sort(
                (tx1: FullWithTx, tx2: FullWithTx) =>
                  Number(tx2.l2timeStamp) - Number(tx1.l2timeStamp)
              );

        setWithdrawLoading(
          userTxfromSubgraph.formattedWithdraw.length > 0 && allTxs.length > 0
            ? "present"
            : userTxfromSubgraph.formattedWithdraw.length === 0
            ? "absent"
            : "loading"
        );
        return setTDataWithdraw(allTxs);
      }
    },
    [userTxfromSubgraph]
  );

  const fetchDepositTransactions = useCallback(
    async (set: boolean) => {
      if (
        l2ProSDK !== undefined &&
        l1Pro !== undefined &&
        l2Pro !== undefined &&
        userTxfromSubgraph !== undefined
      ) {
        set && userTxfromSubgraph?.formattedL1DepositResults.length > 0
          ? setDepositLoading("loading")
          : setDepositLoading("absent");

        const l2DepTxs = await Promise.all(
          userTxfromSubgraph.formattedDeposit
            .map(async (tx: UserL2Transaction) => {
              const l1Tx = await l2ProSDK.getTransaction(tx.transactionHash);
              const l2block = await l2ProSDK.getBlock(Number(tx.blockNumber));
              const l1Block = await l1Pro.getBlock(Number(l1Tx.l1BlockNumber)); ///take a look to use proviver instead of tokamak providee
              const l1tx = userTxfromSubgraph.formattedL1DepositResults?.filter(
                (l1tx: SentMessages) => {
                  return Number(l1tx.messageNonce) === l1Tx.nonce;
                }
              );

              if (l1tx.length > 0) {
                const l1TxHash = l1tx[0].transactionHash;
                const l1timeStamp = Number(l1tx[0].blockTimestamp);
                let txCopy = {
                  ...tx,
                  ...l1Tx,
                  l2block: l2block,
                  l2timeStamp: l2block.timestamp,
                  l1timeStamp: l1timeStamp,
                  l1Block: l1Block,
                  l2txHash: tx.transactionHash,
                  l1txHash: l1TxHash,
                  event: "deposit",
                  _amount: l1tx[0]._amount,
                  _l1Token: l1tx[0]._l1Token,
                  _l2Token: l1tx[0]._l2Token,
                };
                return txCopy;
              }
            })
            .sort(
              (tx1: UserL2Transaction, tx2: UserL2Transaction) =>
                tx1.blockNumber - tx2.blockNumber
            )
        );

        const l1DepTxs = await Promise.all(
          userTxfromSubgraph.formattedL1DepositResults.map(async (tx: any) => {
            const l2tx = l2DepTxs.filter((l2tx: FullDepTx) => {
              return (
                l2tx !== undefined && l2tx.nonce === Number(tx.messageNonce)
              );
            });

            if (l2tx.length > 0) {
              const l2BlockNum = l2tx[0].blockNumber;
              const l1Block = l2tx[0].l1Block;
              const l1timeStamp = l1Block.timestamp;
              let txCopy = {
                ...tx,
                l2timeStamp: l2tx[0].l2timeStamp,
                l1timeStamp: l1timeStamp,
                l1Block: l1Block,
                l2txHash: l2tx[0].transactionHash,
                l1txHash: tx.transactionHash,
                _amount: tx._amount,
                _l1Token: tx._l1Token,
                _l2Token: tx._l2Token,
              };
              return txCopy;
            } else {
              const l1Block = await l1Pro.getBlock(Number(tx.blockNumber));
              const l1timeStamp = l1Block.timestamp;
              let txCopy = {
                ...tx,
                l1timeStamp: l1timeStamp,
                l1txHash: tx.transactionHash,
              };
              return txCopy;
            }
          })
        );

        const txLogs = l1DepTxs;

        const status =
          txLogs.length > 0
            ? "present"
            : userTxfromSubgraph?.formattedL1DepositResults.length === 0
            ? "absent"
            : "loading";
        setDepositLoading(status);

        return setTDataDeposit(txLogs);
      }
    },
    [userTxfromSubgraph, address]
  );

  useEffect(() => {
    fetchWithdrawTransactions(true);
    fetchDepositTransactions(true);
    // const timer = setInterval(() => {
    //   fetchWithdrawTransactions(false);
    //   fetchDepositTransactions(false);
    // }, 3000);

    // return () => clearInterval(timer);
  }, [userTxfromSubgraph, layer, isConnectedToMainNetwork]);

  const stat = useMemo(() => {
    if (
      userTxfromSubgraph !== undefined &&
      userTxfromSubgraph.formattedDeposit.length === 0 &&
      userTxfromSubgraph.formattedL1DepositResults.length === 0 &&
      userTxfromSubgraph.formattedL1WithdrawResults.length === 0 &&
      userTxfromSubgraph.formattedWithdraw.length === 0
    ) {
      return "absent";
    }

    return withdrawLoading === "loading" || depositLoading === "loading"
      ? "loading"
      : withdrawLoading === "absent" && depositLoading === "absent"
      ? "absent"
      : withdrawLoading === "present" || depositLoading === "present"
      ? "present"
      : "loading";
  }, [address, withdrawLoading, depositLoading]);

  const allTxs =
    userTxfromSubgraph !== undefined &&
    userTxfromSubgraph.formattedDeposit.length === 0 &&
    userTxfromSubgraph.formattedL1DepositResults.length === 0 &&
    userTxfromSubgraph.formattedL1WithdrawResults.length === 0 &&
    userTxfromSubgraph.formattedWithdraw.length === 0
      ? []
      : stat === "present"
      ? tDataWithdraw
          .concat(tDataDeposit)
          .sort((tx1: FullDepTx, tx2: FullDepTx) =>
            // Number(tx2.l1timeStamp) - Number(tx1.l1timeStamp) ||
            // Number(tx1.l2timeStamp) - Number(tx2.l2timeStamp)
            tx2.l1timeStamp && tx1.l1timeStamp
              ? Number(tx2.l1timeStamp) - Number(tx1.l1timeStamp)
              : tx2.l1timeStamp && tx1.l1timeStamp === undefined
              ? Number(tx2.l1timeStamp) - Number(tx1.l2timeStamp)
              : tx2.l1timeStamp === undefined && tx1.l1timeStamp
              ? Number(tx2.l2timeStamp) - Number(tx1.l1timeStamp)
              : Number(tx2.l2timeStamp) - Number(tx1.l2timeStamp)
          )
      : [];
  // const allTxs = useMemo(() => {
  //   if (
  //     userTxfromSubgraph !== undefined &&
  //     userTxfromSubgraph.formattedDeposit.length === 0 &&
  //     userTxfromSubgraph.formattedL1DepositResults.length === 0 &&
  //     userTxfromSubgraph.formattedL1WithdrawResults.length === 0 &&
  //     userTxfromSubgraph.formattedWithdraw.length === 0
  //   ) {
  //     return [];
  //   }
  //   return stat === "present"
  //     ? tDataWithdraw
  //         .concat(tDataDeposit)
  //         .sort((tx1: FullDepTx, tx2: FullDepTx) =>
  //           // Number(tx2.l1timeStamp) - Number(tx1.l1timeStamp) ||
  //           // Number(tx1.l2timeStamp) - Number(tx2.l2timeStamp)
  //           tx2.l1timeStamp && tx1.l1timeStamp
  //             ? Number(tx2.l1timeStamp) - Number(tx1.l1timeStamp)
  //             : tx2.l1timeStamp && tx1.l1timeStamp === undefined
  //             ? Number(tx2.l1timeStamp) - Number(tx1.l2timeStamp)
  //             : tx2.l1timeStamp === undefined && tx1.l1timeStamp
  //             ? Number(tx2.l2timeStamp) - Number(tx1.l1timeStamp)
  //             : Number(tx2.l2timeStamp) - Number(tx1.l2timeStamp)
  //         )
  //     : [];
  // }, [address, tDataWithdraw, stat, tDataDeposit]);

  // const getUpdatedWithdraw = async (incompleteWiths: any) => {
  //   let tx;
  //   if (incompleteWiths.l2TxReceipt !== undefined && l2Pro !== undefined) {
  //     const resolved = await crossMessengerTokamak.toCrossChainMessage(
  //       incompleteWiths.transactionHash
  //     ); //  office node ok

  //     const currentStatus = await crossMessenger.getMessageStatus(resolved); //no office node

  //     const l2TxReceipt = await l2Pro.getTransactionReceipt(
  //       incompleteWiths.transactionHash
  //     ); //l2 tx receipt
  //     const logs = ethers.utils.defaultAbiCoder.decode(
  //       ["address", "uint256", "bytes"],
  //       l2TxReceipt.logs[3].data
  //     );
  //     const l1Token = ethers.utils.defaultAbiCoder.decode(
  //       ["address"],
  //       l2TxReceipt.logs[3].topics[1]
  //     )[0];
  //     const l2Token = ethers.utils.defaultAbiCoder.decode(
  //       ["address"],
  //       l2TxReceipt.logs[3].topics[2]
  //     )[0];

  //     // if currentStatus is 2 then the tx is still in rollup period ( wait 5 mins for rollup).
  //     //if status is 4, rollup is finish and tx ready for challenge period
  //     if (
  //       (currentStatus === 2 || currentStatus === 3) &&
  //       l2TxReceipt !== undefined
  //     ) {
  //       const amnt = BigInt(logs[1]).toString();
  //       tx = {
  //         ...incompleteWiths,
  //         l2timeStamp: incompleteWiths.blockTimestamp,
  //         l2txHash: incompleteWiths.transactionHash,
  //         _l1Token: l1Token,
  //         _l2Token: l2Token,
  //         _amount: amnt,
  //         l2TxReceipt: l2TxReceipt,
  //         currentStatus: currentStatus,
  //         resolved: resolved,
  //       };
  //     } else if (currentStatus === 4 && l2TxReceipt.blockNumber !== undefined) {
  //       const l2BlockNum = await l2Pro.getBlock(l2TxReceipt.blockNumber);
  //       const calculatedTimePeriod = isConnectedToMainNetwork
  //         ? 11 * 60 + 7 * 24 * 60 * 60
  //         : 2 * 60 + 10 + 150;
  //       const testPeriod = l2BlockNum.timestamp + calculatedTimePeriod;

  //       // const challengePeriod =
  //       //   await crossMessengerTokamak.getChallengePeriodSeconds(); //office node ok
  //       const timeReadyForRelay = testPeriod;
  //       const amnt = BigInt(logs[1]).toString();
  //       tx = {
  //         ...incompleteWiths,
  //         l2TxReceipt: l2TxReceipt,
  //         l2timeStamp: incompleteWiths.blockTimestamp,
  //         l2txHash: incompleteWiths.transactionHash,
  //         event: "withdraw",
  //         _l1Token: l1Token,
  //         _l2Token: l2Token,
  //         _amount: amnt,
  //         timeReadyForRelay: Number(timeReadyForRelay),
  //         currentStatus: currentStatus,
  //         resolved: resolved,
  //       };
  //     } else {
  //       const receipt = await crossMessenger.getMessageReceipt(resolved); //  no office node
  //       if (
  //         l2TxReceipt.blockNumber !== undefined &&
  //         receipt != null &&
  //         receipt.transactionReceipt != null
  //       ) {
  //         const matchTx = receipt.transactionReceipt.transactionHash;
  //         const l1tx = userTxfromSubgraph.formattedL1WithdrawResults.filter(
  //           (tx: EthType | Erc20Type) => {
  //             return tx.transactionHash === matchTx;
  //           }
  //         )[0];

  //         if (l1tx) {
  //           let copy = {
  //             ...incompleteWiths,
  //             ...l1tx,
  //             l2TxReceipt: l2TxReceipt,
  //             l2timeStamp: incompleteWiths.blockTimestamp,
  //             l1timeStamp: l1tx ? l1tx.blockTimestamp : 0,
  //             l1Block: l1tx.blockNumber,
  //             l2txHash: incompleteWiths.transactionHash,
  //             l1txHash: l1tx.transactionHash,
  //             event: "withdraw",
  //             _amount: l1tx._amount,
  //             _l1Token: l1tx._l1Token,
  //             _l2Token: l1tx._l2Token,
  //             currentStatus: currentStatus,
  //             resolved: resolved,
  //           };
  //           tx = copy;
  //         }
  //       } else {
  //         const amnt = BigInt(logs[1]).toString();
  //         let copy = {
  //           ...incompleteWiths,
  //           l2TxReceipt: l2TxReceipt,
  //           l2timeStamp: incompleteWiths.blockTimestamp,
  //           l2txHash: incompleteWiths.transactionHash,
  //           event: "withdraw",
  //           _l1Token: l1Token,
  //           _l2Token: l2Token,
  //           _amount: amnt,
  //           currentStatus: currentStatus,
  //           resolved: resolved,
  //         };
  //         tx = copy;
  //       }
  //     }
  //   }

  //   return tx;
  // };

  // const getUpdatedDep = async (incompleteDeps: any) => {
  //   console.log('incompleteDeps',incompleteDeps);

  //   if (l1Pro !== undefined && incompleteDeps !== undefined) {
  //     const l1Tx = await l2ProSDK.getTransaction(
  //       incompleteDeps.transactionHash
  //     );
  //     const l2block = await l2ProSDK.getBlock(
  //       Number(incompleteDeps.blockNumber)
  //     );
  //     const l1Block = await l1Pro.getBlock(Number(l1Tx.l1BlockNumber)); ///take a look to use proviver instead of tokamak providee
  //     const l1tx = userTxfromSubgraph.formattedL1DepositResults?.filter(
  //       (l1tx: SentMessages) => {
  //         return Number(l1tx.messageNonce) === l1Tx.nonce;
  //       }
  //     );

  //     if (l1tx.length > 0) {
  //       const l1TxHash = l1tx[0].transactionHash;
  //       const l1timeStamp = Number(l1tx[0].blockTimestamp);
  //       let txCopy = {
  //         ...incompleteDeps,
  //         ...l1Tx,
  //         l2block: l2block,
  //         l2timeStamp: l2block.timestamp,
  //         l1timeStamp: l1timeStamp,
  //         l1Block: l1Block,
  //         l2txHash: incompleteDeps.transactionHash,
  //         l1txHash: l1TxHash,
  //         event: "deposit",
  //         _amount: l1tx[0]._amount,
  //         _l1Token: l1tx[0]._l1Token,
  //         _l2Token: l1tx[0]._l2Token,
  //       };
  //       return txCopy;
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const getUpdatedTxs = async () => {
  //     if (userTxfromSubgraph !== undefined) {
  //       const txFromGraph =
  //         layer === "L1"
  //           ? userTxfromSubgraph?.formattedL1DepositResults.concat(
  //               userTxfromSubgraph.formattedL1WithdrawResults
  //             )
  //           : userTxfromSubgraph?.formattedDeposit.concat(
  //               userTxfromSubgraph.formattedWithdraw
  //             );

  //       const newTxfromGraph = txFromGraph.filter((tx: any) => {
  //         const newTx =
  //           tx.event === "deposit"
  //             ? allTxs.filter((tx2) => tx2.l1txHash === tx.transactionHash)
  //             : allTxs.map((tx2) => tx2.l2txHash === tx.transactionHash);
  //       });

  //       const incompleted = allTxs.filter((tx: any) => {
  //         return (
  //           (tx.event === "withdraw" && tx.currentStatus !== 6) ||
  //           (tx.event === "withdraw" && tx.currentStatus !== 5) ||
  //           (tx.event === "deposit" && tx.l2txHash === undefined)
  //         );
  //       });

  //       const completed = allTxs.filter(
  //         (element: any) => !incompleted.includes(element)
  //       );

  //       let txs: any = [];
  //       if (incompleted.length > 0) {
  //         const updated = await Promise.all(
  //           incompleted.map(async (incompletedTx) => {
  //             if (incompletedTx.event === "deposit") {
  //               // const updatedDeps = await getUpdatedDep(incompletedTx);

  //               // console.log("updatedDeps", updatedDeps);

  //               // return updatedDeps;
  //             } else {
  //               const updatedWiths = await getUpdatedWithdraw(incompletedTx);
  //               return updatedWiths;
  //             }
  //           })
  //         );
  //         txs = updated
  //       }

  //       console.log('txs',txs);

  //       const allTx = completed.concat(txs)
  //       console.log(allTx);

  //     }
  //   };

  //   const timeinterval = setInterval(() => {
  //     getUpdatedTxs();
  //   }, 3000);

  //   return () => clearInterval(timeinterval);
  // }, [userTxfromSubgraph, stat]);

  return { depositTxs: allTxs, loadingState: stat };
}
