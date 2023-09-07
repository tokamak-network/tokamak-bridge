import { transactionData } from "@/recoil/global/transaction";
import { useProvier } from "../provider/useProvider";
import { useCallback, useEffect, useMemo, useState } from "react";
import useContract from "@/hooks/contracts/useContract";
import { useAccount } from "wagmi";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import useConnectedNetwork from "../network";
import { useNetwork } from "wagmi";
import { getProvider } from "@/config/getProvider";
import useGetTxLayers from "./useGetTxLayers";
import { fetchUserTransactions } from "@/components/history/utils/fetchUserTransactions";
import { ethers } from "ethers";
import useCrosschainMessenger from "./useCrosschainMessenger";
import {
  L1TxType,
  SentMessages,
  EthType,
  Erc20Type,
  DepositTx,
  UserL2Transaction,
  FullDepTx,
  FullWithTx,
} from "@/types/activity/history";

export default function useGetTransaction() {
  const [tDataDeposit, setTDataDeposit] = useState<FullDepTx[]>([]);
  const [tDataWithdraw, setTDataWithdraw] = useState<any[]>([]);
  const { provider } = useProvier();
  const { L2BRIDGE_CONTRACT } = useContract();
  const { address } = useAccount();
  const { layer, connectedChainId } = useConnectedNetwork();
  const { chain } = useNetwork();
  const providers = useGetTxLayers();
  const titanSDK = require("@tokamak-network/tokamak-layer2-sdk");
  const { crossMessenger, crossMessengerTokamak } = useCrosschainMessenger();
  const l2ProSDK = titanSDK.asL2Provider(getProvider(providers.l2Provider));
  const l2Pro = layer === "L2" ? provider : getProvider(providers.l2Provider);
  const l1Pro = layer === "L1" ? provider : getProvider(providers.l1Provider);

  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const [withdrawLoading, setWithdrawLoading] = useState<
    "loading" | "present" | "absent"
  >("loading");

  const [depositLoading, setDepositLoading] = useState<
    "loading" | "present" | "absent"
  >("loading");

  const fetchTransactions = useCallback(
    async (set: boolean) => {
      if (
        l2ProSDK !== undefined &&
        l1Pro !== undefined &&
        l2Pro !== undefined &&
        crossMessenger !== undefined &&
        crossMessengerTokamak !== undefined &&
        isConnectedToMainNetwork !== undefined
      ) {
        const userAllTransactions = await fetchUserTransactions(
          address,
          isConnectedToMainNetwork
        );

        if (userAllTransactions !== undefined) {
          set &&
            setWithdrawLoading(
              userAllTransactions.formattedWithdraw.length > 0
                ? "loading"
                : "absent"
            );
          const l2WithdrawTxs = await Promise.all(
            userAllTransactions.formattedWithdraw.map(async (tx: L1TxType) => {
              const resolved = await crossMessengerTokamak.toCrossChainMessage(
                tx.transactionHash
              ); //  office node ok

              const currentStatus = await crossMessenger.getMessageStatus(
                resolved
              );

              //no office node

              const l2TxReceipt = await l2Pro.getTransactionReceipt(
                tx.transactionHash
              ); //l2 tx receipt
              const logs = await ethers.utils.defaultAbiCoder.decode(
                ["address", "uint256", "bytes"],
                l2TxReceipt.logs[3].data
              );
              const l1Token = ethers.utils.defaultAbiCoder.decode(
                ["address"],
                l2TxReceipt.logs[3].topics[1]
              )[0];
              const l2Token = ethers.utils.defaultAbiCoder.decode(
                ["address"],
                l2TxReceipt.logs[3].topics[2]
              )[0];

              // if currentStatus is 2 then the tx is still in rollup period ( wait 5 mins for rollup).
              //if status is 4, rollup is finish and tx ready for challenge period

              if (
                (currentStatus === 2 || currentStatus === 3) &&
                l2TxReceipt !== undefined
              ) {
                const amnt = BigInt(logs[1]).toString();

                let copy = {
                  ...tx,
                  event: "withdraw",
                  l2timeStamp: tx.blockTimestamp,
                  l2txHash: tx.transactionHash,
                  _l1Token: l1Token,
                  _l2Token: l2Token,
                  _amount: amnt,
                  l2TxReceipt: l2TxReceipt,
                  currentStatus: currentStatus,
                  resolved: resolved,
                };
                return copy;
              } else if (
                currentStatus === 4 &&
                l2TxReceipt.blockNumber !== undefined
              ) {
                const l2BlockNum = await l2Pro.getBlock(
                  l2TxReceipt.blockNumber
                );
                const calculatedTimePeriod = isConnectedToMainNetwork
                  ? 11 * 60 + 7 * 24 * 60 * 60
                  : 2 * 60 + 10 + 150;
                const testPeriod = l2BlockNum.timestamp + calculatedTimePeriod;

                // const challengePeriod =
                //   await crossMessengerTokamak.getChallengePeriodSeconds(); //office node ok
                const timeReadyForRelay = testPeriod;

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
                  timeReadyForRelay: Number(timeReadyForRelay),
                  currentStatus: currentStatus,
                  resolved: resolved,
                };
                return copy;
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
                    userAllTransactions.formattedL1WithdrawResults.filter(
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
                      // timeReadyForRelay:1692685734
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
                    // timeReadyForRelay:timeReadyForRelay
                  };
                  return copy;
                }
              }
            })
          );

          const allTxs =
            layer == "L1"
              ? l2WithdrawTxs.sort(
                  (tx1: FullWithTx, tx2: FullWithTx) =>
                    Number(tx2.l2timeStamp) - Number(tx1.l2timeStamp)
                )
              : l2WithdrawTxs.sort(
                  (tx1: FullWithTx, tx2: FullWithTx) =>
                    Number(tx2.l2timeStamp) - Number(tx1.l2timeStamp)
                );

          // const stats = userAllTransactions.formattedWithdraw.length === 0? 'absent': userAllTransactions.formattedWithdraw.length !== 0 && allTxs.length > 0 ?'present':'loading'
          setTDataWithdraw(allTxs);
          setWithdrawLoading(
            userAllTransactions.formattedWithdraw.length > 0 &&
              allTxs.length > 0
              ? "present"
              : "loading"
          );
        }
      }
    },
    [address, connectedChainId, crossMessenger]
  );


  const fetchDepositTransactions = useCallback(
    async (set: boolean) => {
      if (
        l2ProSDK !== undefined &&
        l1Pro !== undefined &&
        l2Pro !== undefined &&
        isConnectedToMainNetwork !== undefined
      ) {
        const l2Bridge = new ethers.Contract(
          L2BRIDGE_CONTRACT,
          L2BridgeAbi,
          l2ProSDK
        );

        const userAllTransactions = await fetchUserTransactions(
          address,
          isConnectedToMainNetwork
        );

        if (
          userAllTransactions?.formattedL1DepositResults.length !== 0 &&
          userAllTransactions?.formattedDeposit !== 0
        ) {
          if (userAllTransactions !== undefined) {
            set &&
              setDepositLoading(
                userAllTransactions?.formattedL1DepositResults.length > 0
                  ? "loading"
                  : "absent"
              );
            const l2DepTxs = await Promise.all(
              userAllTransactions?.formattedDeposit
                .sort(
                  (tx1: UserL2Transaction, tx2: UserL2Transaction) =>
                    tx1.blockNumber - tx2.blockNumber
                )
                .map(async (tx: UserL2Transaction) => {
                  const txion = await l2ProSDK.getTransaction(
                    tx.transactionHash
                  );

                  const l2block = await l2ProSDK.getBlock(
                    Number(tx.blockNumber)
                  );
                  const l1Block = await getProvider(
                    providers.l1Provider
                  )?.getBlock(Number(txion.l1BlockNumber));
                  const l1tx =
                    userAllTransactions.formattedL1DepositResults?.filter(
                      (l1tx: SentMessages) => {
                        return Number(l1tx.messageNonce) === txion.nonce;
                      }
                    );

                  if (l1tx.length > 0) {
                    const l1BlockNum = Number(l1tx[0].blockNumber);
                    const l1TxHash = l1tx[0].transactionHash;
                    const l1timeStamp = Number(l1tx[0].blockTimestamp);
                    let txCopy = {
                      ...tx,
                      ...txion,
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
            );

            const l1DepTxs = await Promise.all(
              userAllTransactions.formattedL1DepositResults.map(
                async (tx: DepositTx) => {
                  const l2tx = l2DepTxs.filter((l2tx: FullDepTx) => {
                    return l2tx.nonce === Number(tx.messageNonce);
                  });

                  if (l2tx.length > 0) {
                    const l2BlockNum = l2tx[0].blockNumber;
                    const l2Block = await l2Pro.getBlock(l2BlockNum);
                    const l2timestamp = await l2Block.timestamp;
                    const l1Block = await l1Pro.getBlock(
                      Number(tx.blockNumber)
                    );
                    const l1timeStamp = l1Block.timestamp;
                    let txCopy = {
                      ...tx,
                      l2timeStamp: l2timestamp,
                      l1timeStamp: l1timeStamp,
                      l1Block: l1Block,
                      l2txHash: l2tx[0].transactionHash,
                      l1txHash: tx.transactionHash,
                    };
                    return txCopy;
                  } else {
                    const l1Block = await l1Pro.getBlock(
                      Number(tx.blockNumber)
                    );
                    const l1timeStamp = l1Block.timestamp;
                    let txCopy = {
                      ...tx,
                      l1timeStamp: l1timeStamp,
                      l1txHash: tx.transactionHash,
                    };
                    return txCopy;
                  }
                }
              )
            );
            const txLogs = layer == "L1" ? l1DepTxs : l2DepTxs;

            setTDataDeposit(txLogs);
            const status = txLogs.length > 0 ? "present" : "loading";
            setDepositLoading(status);
          }
        }
      }
    },
    [address, connectedChainId]
  );

const getUpdatedWithdraw = async(incompleteWiths:any) => {
  console.log('incompleteWiths',incompleteWiths);
  
  if (incompleteWiths.length > 0) {
    const l2WithdrawTxs = await Promise.all(incompleteWiths.map((incompleteWith:any) => {
if (
                (incompleteWith.currentStatus === 2 || incompleteWith.currentStatus === 3) &&
                incompleteWith.l2TxReceipt !== undefined
              ){
                console.log('mm');
                
              }
    })
    )
  }
}

const getUpdatedDep = async(incompleteDeps:any) => {
  if (incompleteDeps.length > 0) {
    const l2WithdrawTxs = await Promise.all(incompleteDeps.map((incompleteDep:any) => {

    })
    )
  }
}

  useEffect(() => {
    fetchTransactions(true);
    fetchDepositTransactions(true);
    const xx = setInterval(() => {
      fetchTransactions(false);
      fetchDepositTransactions(false);
    }, 3000);

    return () => clearInterval(xx);
  }, [address, connectedChainId, crossMessenger]);

  const stat =
    withdrawLoading === "loading" || depositLoading === "loading"
      ? "loading"
      : withdrawLoading === "absent" && depositLoading === "absent"
      ? "absent"
      : withdrawLoading === "present" || depositLoading === "present"
      ? "present"
      : "loading";

  const allTxs =
    stat === "present"
      ? layer == "L1"
        ? tDataWithdraw
            .concat(tDataDeposit)
            .sort(
              (tx1: FullDepTx, tx2: FullDepTx) =>
                Number(tx2.l1timeStamp) - Number(tx1.l1timeStamp)
            )
        : tDataWithdraw
            .concat(tDataDeposit)
            .sort(
              (tx1: FullDepTx, tx2: FullDepTx) =>
                Number(tx2.l2timeStamp) - Number(tx1.l2timeStamp)
            )
      : [];

  // useEffect(() => {
  //   console.log('stat',stat);
    
  //   const xx = async () => {
  //     if (isConnectedToMainNetwork !== undefined) {
  //       const allTxs =
  //         stat === "present"
  //           ? layer == "L1"
  //             ? tDataWithdraw
  //                 .concat(tDataDeposit)
  //                 .sort(
  //                   (tx1: FullDepTx, tx2: FullDepTx) =>
  //                     Number(tx2.l1timeStamp) - Number(tx1.l1timeStamp)
  //                 )
  //             : tDataWithdraw
  //                 .concat(tDataDeposit)
  //                 .sort(
  //                   (tx1: FullDepTx, tx2: FullDepTx) =>
  //                     Number(tx2.l2timeStamp) - Number(tx1.l2timeStamp)
  //                 )
  //           : [];

  //       const userAllTransactions = await fetchUserTransactions(
  //         address,
  //         isConnectedToMainNetwork
  //       );
  //       const txFromGraph =
  //         layer === "L1"
  //           ? userAllTransactions?.formattedL1DepositResults.concat(
  //               userAllTransactions.formattedL1WithdrawResults
  //             )
  //           : userAllTransactions?.formattedDeposit.concat(
  //               userAllTransactions.formattedWithdraw
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
  //           (tx.event === "deposit" && tx.l2txHash === undefined)
  //         );
  //       });        

  //       const completed = allTxs.filter(
  //         (element: any) => !incompleted.includes(element)
  //       );

  //       if (incompleted.length> 0) {
          
  //         incompleted.map((incompletedTx) => {
  //           if (incompletedTx.event === 'deposit') {
  //             getUpdatedDep(incompletedTx)
  //           }

  //           else {
  //             getUpdatedWithdraw(incompletedTx)
  //           }
  //         })
  //       }

  //     }
  //   };
  // const timeinterval = setInterval(() => {
  //   xx();
  //   }, 3000);

  //   return () => clearInterval(timeinterval);
   
  // }, [tDataWithdraw, tDataDeposit, stat, layer]);

  return { depositTxs: allTxs, loadingState: stat };
}
