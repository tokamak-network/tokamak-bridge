import { useProvier } from "../provider/useProvider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import useConnectedNetwork from "../network";
import { fetchUserTransactions } from "@/components/history/utils/fetchUserTransactions";
import { ethers } from "ethers";
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

  //titanSDK as an L2 provider for certain functions
  const l2ProSDK = titanSDK.asL2Provider(
    layer === "L2" ? provider : L2Provider
  );

  //use metamask provider if connected to L2 and use tokamak titan L2 provider if connected to L1
  const l2Pro = layer === "L2" ? provider : L2Provider;

  //use metamask provider if connected to L1 and use tokamak ethereum provider if connected to L2
  const l1Pro = layer === "L1" ? provider : L1Provider;

  //recoil state to store the txs from the subgraph
  const [userTxfromSubgraph, setUserTxfromSubgraph] =
    useRecoilState(userTransactions);

  const { isConnectedToMainNetwork } = useConnectedNetwork();

  //state tot check whether the withdraw data is absent or if data is loading and present
  const [withdrawLoading, setWithdrawLoading] = useState<
    "loading" | "present" | "absent"
  >("loading");

  //state tot check whether the deposit data is absent or if data is loading and present
  const [depositLoading, setDepositLoading] = useState<
    "loading" | "present" | "absent"
  >("loading");

  //data from the subgraphs are re-fetched every time the user address, connected layer, or the network status changes
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

  //this function fetches the withdraw txs and their data and reformats the data
  //takes the input boolean parameter 'set' to check if the loading status of the txs should be set or not
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
        //if 'set' parameter is set to true and there are formatted withdraw txs coming from the subgraph,
        //set the withdraw tx loading status to 'loading' and if not to 'absent'
        set &&
          setWithdrawLoading(
            userTxfromSubgraph.formattedWithdraw.length > 0
              ? "loading"
              : "absent"
          );

        //creates an array for all the txs in the userTxfromSubgraph.formattedWithdraw data with additional information
        const l2WithdrawTxs = await Promise.all(
          userTxfromSubgraph.formattedWithdraw.map(
            async (tx: L1TxType, index: number) => {
              // the resolved object from the crossChain messenger sdk is needed for the other SDK calls
              const resolved = await crossMessengerTokamak.toCrossChainMessage(
                tx.transactionHash
              ); //  office node ok

              //returns the current status of the transaction.
              const currentStatus = await crossMessenger.getMessageStatus(
                resolved
              ); //no office node

              //the meaning of each status can be found here
              //https://www.notion.so/onther/Lakmi-s-Handover-Tasks-74f3fe996632480bb827148b3488e382?pvs=4#c74175edb844412b8f20f920fca76e19

              // returns l2 tx receipt
              const l2TxReceipt = await l2Pro.getTransactionReceipt(
                tx.transactionHash
              );

              //using the logs of the tx receipt, we can determine the l1 token address and the l2 token address of the withdraw tx
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

                // if currentStatus is 2 or 3 then the tx is still in rollup period ( wait 5 mins for rollup).
                //if status is 4, rollup is finish and tx ready for challenge period

                //if the l2txReceipt is not undefined, and rollup is not finished, return the withdraw tx object with the following data
                if (
                  (currentStatus === 2 || currentStatus === 3) &&
                  l2TxReceipt !== undefined
                ) {
                  //withdraw token amount can be found using the receipt logs
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
                }

                // if the current status is 4 rollup has finished and is on l1 waiting for challenge period
                else if (
                  currentStatus === 4 &&
                  l2TxReceipt.blockNumber !== undefined
                ) {
                  //the l2 block number is useful when calculating the time take for the rollup and challenge period to finish
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

                  //in mainnet it takes 11 minutes for rollup to finish and 7 days for the challenge period. These two times are converted to seconds
                  // in testnet it takes 2 minutes for rollup to finish and 10 seconds for the challenge period. Additional buffer of 150 seconds is given. These 3 times are converted to seconds
                  const calculatedTimePeriod = isConnectedToMainNetwork
                    ? 11 * 60 + 7 * 24 * 60 * 60
                    : 2 * 60 + 10 + 150;

                  //this is the unix timestamp when the tx is ready to be relayed (rollup & challenge is finished)
                  const testPeriod =
                    l2BlockNum.timestamp + calculatedTimePeriod;

                  // const challengePeriod =
                  //   await crossMessengerTokamak.getChallengePeriodSeconds(); //office node ok
                  const timeReadyForRelay = testPeriod;

                  const amnt = BigInt(logs[1]).toString();

                  //if the tx is ready to be relayed, return the following information
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
                }
                //if the status is 5 or 6, check if the message receipt exists. returns the tx receipt of the corresponding l1 withdraw tx
                //If the receipt is not null, then the tx has been relayed to l1 and an L1 tx exists.
                //If the receipt is null, L1 tx does not exist yet.
                else {
                  const receipt = await crossMessenger.getMessageReceipt(
                    resolved
                  ); //  no office node

                  if (
                    l2TxReceipt.blockNumber !== undefined &&
                    receipt != null &&
                    receipt.transactionReceipt != null
                  ) {
                    //l1 tx transaction hash
                    const matchTx = receipt.transactionReceipt.transactionHash;

                    //finds the corresponding data object of the l1 tx from the subgraph data
                    const l1tx =
                      userTxfromSubgraph.formattedL1WithdrawResults.filter(
                        (tx: EthType | Erc20Type) => {
                          return tx.transactionHash === matchTx;
                        }
                      )[0];

                    //if subgraph data exists for the l1 tx, then return the following data
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
                  }
                  //if there is no l1 receipt, then return the following data
                  else {
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

        // remove undefined fields of old Tx using old smart contract schema
        const filteredl2WithdrawTxs = l2WithdrawTxs.filter(
          (tx: FullWithTx) => tx !== undefined
        );

        //l2WithdrawTxs returns all the withdraw txs that belong to the user.
        //sort the txs by the descending order of the l2 timestamp
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

        //if the length of the above sorted array > 0 and if the userTxfromSubgraph.formattedWithdraw.length > 0 set the loading status to present
        setWithdrawLoading(
          userTxfromSubgraph.formattedWithdraw.length > 0 && allTxs.length > 0
            ? "present"
            : userTxfromSubgraph.formattedWithdraw.length === 0 //if there are no txs from subgraph set the loading status to absent
            ? "absent"
            : "loading"
        );
        return setTDataWithdraw(allTxs);
      }
    },
    [userTxfromSubgraph]
  );

  //this function fetches the deposit txs and their data and reformats the data
  //takes the input boolean parameter 'set' to check if the loading status of the txs should be set or not
  const fetchDepositTransactions = useCallback(
    async (set: boolean) => {
      if (
        l2ProSDK !== undefined &&
        l1Pro !== undefined &&
        l2Pro !== undefined &&
        userTxfromSubgraph !== undefined
      ) {
        //if 'set' parameter is set to true and there are formatted deposit txs coming from the subgraph,
        //set the deposit tx loading status to 'loading' and if not to 'absent'
        set && userTxfromSubgraph?.formattedL1DepositResults.length > 0
          ? setDepositLoading("loading")
          : setDepositLoading("absent");

        //creates an array for all the txs in the userTxfromSubgraph.formattedDeposit data with additional information
        // these are the deposit txs that are already appeared on L2
        const l2DepTxs = await Promise.all(
          userTxfromSubgraph.formattedDeposit
            .map(async (tx: UserL2Transaction) => {
              //gets the l1 deposit tx data from the titan sdk
              const l1Tx = await l2ProSDK.getTransaction(tx.transactionHash);

              //gets the l2 block from the titan sdk
              const l2block = await l2ProSDK.getBlock(Number(tx.blockNumber));

              //gets the l1 block from the titan sdk using the l2 deposit tx data fetched form the SDK
              const l1Block = await l1Pro.getBlock(Number(l1Tx.l1BlockNumber)); ///take a look to use proviver instead of tokamak provider

              // filter the corresponding subgraph tx for this tx using the message Nonce
              const l1tx = userTxfromSubgraph.formattedL1DepositResults?.filter(
                (l1tx: SentMessages) => {
                  return Number(l1tx.messageNonce) === l1Tx.nonce;
                }
              );

              //if there is a corresponding tx from the subgraph exists return the following data
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
            ) //sort the txs by the block number in ascending order
        );

        //all the deposit txs in l1 including txs with corresponding l2 txs and txs without l2 txs
        const l1DepTxs = await Promise.all(
          userTxfromSubgraph.formattedL1DepositResults.map(async (tx: any) => {
            //filter the txs with a corresponding l2 tx using the message nonce
            const l2tx = l2DepTxs.filter((l2tx: FullDepTx) => {
              return (
                l2tx !== undefined && l2tx.nonce === Number(tx.messageNonce)
              );
            });

            //if there is a corresponding l2 tx return the following data
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
            }
            //if there is no l2 tx, return this information
            else {
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

        //if the length of the above l1DepTxs array > 0 and if the userTxfromSubgraph.formattedL1DepositResults.length > 0 set the loading status to present
        const status =
          txLogs.length > 0
            ? "present"
            : userTxfromSubgraph?.formattedL1DepositResults.length === 0 //if there are no txs from subgraph set the loading status to absent
            ? "absent"
            : "loading";
        setDepositLoading(status);

        return setTDataDeposit(txLogs);
      }
    },
    [userTxfromSubgraph, address]
  );

  //when the subgraph data, the connected layer or the network changes, refetch both withdraw and deposit txs
  useEffect(() => {
    fetchWithdrawTransactions(true);
    fetchDepositTransactions(true);
  }, [userTxfromSubgraph, layer, isConnectedToMainNetwork]);

  //if none of the queries in the fetchUserTransactions returns any txs, set the loading status to absent
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
    //set the overa;; loading state according to the loading state of each deposit & withdraw
    return withdrawLoading === "loading" || depositLoading === "loading"
      ? "loading"
      : withdrawLoading === "absent" && depositLoading === "absent"
      ? "absent"
      : withdrawLoading === "present" || depositLoading === "present"
      ? "present"
      : "loading";
  }, [address, withdrawLoading, depositLoading]);

  //if there is not subgraph data for any of the tx types, return empty arrow
  const allTxs =
    userTxfromSubgraph !== undefined &&
    userTxfromSubgraph.formattedDeposit.length === 0 &&
    userTxfromSubgraph.formattedL1DepositResults.length === 0 &&
    userTxfromSubgraph.formattedL1WithdrawResults.length === 0 &&
    userTxfromSubgraph.formattedWithdraw.length === 0
      ? []
      : stat === "present" //if there are tx data, sort them according to the following criteria
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

  return { depositTxs: allTxs, loadingState: stat };
}
