import { rollupTime } from "@/constant/history";
import { Resolved } from "@/types/activity/history";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { hashCrossChainMessage } from "@tokamak-network/titan-sdk";
import axios from "axios";
import { BigNumber } from "ethers";

export const getCurretStatus = async (
  l2BlockNumber: number,
  resolved: Resolved
) => {
  const resTxs = await axios.post(
    `${"https://api.studio.thegraph.com/query/77358/tokamak-bridge-history/version/latest"}`,
    {
      query: `
        {
            stateBatchAppendeds(where:{and: [{rollUpBatch_gte: ${l2BlockNumber}}, {_prevTotalElements_lt: ${l2BlockNumber}}]}) {
                blockTimestamp
        }
      }
        `,
    }
  );

  if (resTxs?.data?.data?.stateBatchAppendeds.length > 0) {
    const { blockTimestamp } = resTxs.data.data.stateBatchAppendeds[0];
    const currentTime = Math.floor(Date.now() / 1000);
    const plusChallengePeriod = Number(blockTimestamp) + 7 * 24 * 60 * 60;
    if (plusChallengePeriod > currentTime) {
      return 4;
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
      `${"https://api.studio.thegraph.com/query/77358/tokamak-bridge-history/version/latest"}`,
      {
        query: `
        query GetRelayedMessages($msgHash: String!) {
          relayedMessages(where: {msgHash: $msgHash}) {
            msgHash
          }
        }
      `,
        variables: {
          msgHash: msgHash,
        },
      }
    );
    if (resMesHash?.data?.data?.relayedMessages.length > 0) return 6;
    return 5;
  }
  return 2;
};
