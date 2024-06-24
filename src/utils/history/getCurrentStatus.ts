import { TITAN_CHALLENGE_PERIOD } from "@/constant/network/titan";
import { Resolved } from "@/types/activity/history";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { hashCrossChainMessage } from "@tokamak-network/titan-sdk";
import axios from "axios";
import { BigNumber } from "ethers";
import { stat } from "fs";

export type CurrentStatus = 0 | 1 | 2 | 3 | 4;
export type StateBatchAppended = {
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  _batchIndex: number;
  _batchRoot: string;
  _batchSize: number;
  _extraData: string;
  _prevTotalElements: number;
};
export type RelayMessage = {
  blockNumber: number;
  blockTimestamp: number;
  msgHash: string;
  transactionHash: string;
};

/**
 *
 * @param l2BlockNumber
 * @param resolved
 * @param isConnectedToMainnet
 * @returns Promise
 * currentStatus
 * - 0 : initiate
 * - 1 : prove
 * - 2 : in Challenge Period
 * - 3 : wait to claim
 * - 4 : done with realyed
 */
export const getCurretStatus = async (
  l2BlockNumber: number,
  resolved: Resolved,
  isConnectedToMainnet: boolean
): Promise<{
  currentStatus: CurrentStatus;
  stateBatchAppendeds?: StateBatchAppended;
  relayedMessageTx?: RelayMessage;
}> => {
  const resTxs = await axios.post(
    `${
      isConnectedToMainnet
        ? process.env.NEXT_PUBLIC_SUBGRAPH_ETHEREUM_HISTORY
        : process.env.NEXT_PUBLIC_SUBGRAPH_SEPOLIA_HISTORY
    }`,
    {
      query: `
        {
          stateBatchAppendeds(where:{and: [{rollUpBatch_gte: ${l2BlockNumber}}, {_prevTotalElements_lt: ${l2BlockNumber}}]}) {
                blockTimestamp
                blockNumber
                _batchIndex
                _batchRoot
                _batchSize
                _prevTotalElements
                _extraData
                transactionHash
          }
      }
        `,
    }
  );

  if (resTxs?.data?.data?.stateBatchAppendeds.length > 0) {
    const _stateBatchAppendeds = resTxs.data.data.stateBatchAppendeds[0];
    const { blockTimestamp } = _stateBatchAppendeds;
    const currentTime = Math.floor(Date.now() / 1000);
    const plusChallengePeriod = Number(blockTimestamp) + TITAN_CHALLENGE_PERIOD;
    const stateBatchAppendeds = {
      ..._stateBatchAppendeds,
      blockNumber: Number(_stateBatchAppendeds.blockNumber),
      blockTimestamp: Number(_stateBatchAppendeds.blockTimestamp),
      _batchIndex: Number(_stateBatchAppendeds._batchIndex),
      _batchSize: Number(_stateBatchAppendeds._batchSize),
      _prevTotalElements: Number(_stateBatchAppendeds._prevTotalElements),
    };
    if (plusChallengePeriod > currentTime) {
      return { currentStatus: 2, stateBatchAppendeds };
    }
    const msgHash = hashCrossChainMessage({
      sender: resolved.sender,
      target: resolved.target,
      message: resolved.message,
      messageNonce: BigNumber.from(resolved.messageNonce),
      minGasLimit: BigNumber.from(0),
      value: BigNumber.from(0),
    });
    const resMesHash = await axios.post(
      `${
        isConnectedToMainnet
          ? process.env.NEXT_PUBLIC_SUBGRAPH_ETHEREUM_HISTORY
          : process.env.NEXT_PUBLIC_SUBGRAPH_SEPOLIA_HISTORY
      }`,
      {
        query: `
        query GetRelayedMessages($msgHash: String!) {
          relayedMessages(where: {msgHash: $msgHash}) {
            msgHash
            transactionHash
            blockTimestamp
            blockNumber
          }
        }
      `,
        variables: {
          msgHash: msgHash,
        },
      }
    );
    if (resMesHash?.data?.data?.relayedMessages.length > 0) {
      const _relayedMessageTx = resMesHash.data.data.relayedMessages[0];
      const relayedMessageTx = {
        ..._relayedMessageTx,
        blockNumber: Number(_relayedMessageTx.blockNumber),
        blockTimestamp: Number(_relayedMessageTx.blockTimestamp),
      };
      return {
        currentStatus: 4,
        stateBatchAppendeds,
        relayedMessageTx,
      };
    }

    return {
      currentStatus: 3,
      stateBatchAppendeds,
    };
  }
  return { currentStatus: 0, stateBatchAppendeds: undefined };
};
