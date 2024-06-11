import { rollupTime } from "@/constant/history";
import { Resolved } from "@/types/activity/history";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { hashCrossChainMessage } from "@tokamak-network/titan-sdk";
import axios from "axios";
import { BigNumber } from "ethers";
import { stat } from "fs";

export const getCurretStatus = async (
  l2BlockNumber: number,
  resolved: Resolved
): Promise<{
  currentStatus: number;
  stateBatchAppendeds: any;
  relayedMessageTxHash?: string;
}> => {
  const resTxs = await axios.post(
    `${"https://api.studio.thegraph.com/query/77358/tokamak-bridge-history/version/latest"}`,
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
    const stateBatchAppendeds = resTxs.data.data.stateBatchAppendeds[0];
    const { blockTimestamp } = stateBatchAppendeds;
    const currentTime = Math.floor(Date.now() / 1000);
    const plusChallengePeriod = Number(blockTimestamp) + 7 * 24 * 60 * 60;
    if (plusChallengePeriod > currentTime) {
      return { currentStatus: 4, stateBatchAppendeds };
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
      `${process.env.NEXT_PUBLIC_HISTORY_L1_SUBGRAPH}`,
      {
        query: `
        query GetRelayedMessages($msgHash: String!) {
          relayedMessages(where: {msgHash: $msgHash}) {
            msgHash
            transactionHash
          }
        }
      `,
        variables: {
          msgHash: msgHash,
        },
      }
    );
    if (resMesHash?.data?.data?.relayedMessages.length > 0) {
      return {
        currentStatus: 6,
        stateBatchAppendeds,
        relayedMessageTxHash:
          resMesHash.data.data.relayedMessages[0].transactionHash,
      };
    }

    return {
      currentStatus: 5,
      stateBatchAppendeds,
    };
  }
  return { currentStatus: 2, stateBatchAppendeds: undefined };
};
