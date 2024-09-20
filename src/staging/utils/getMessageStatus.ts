import { providerByChainId } from "@/config/getProvider";
import {
  Status,
  TransactionHistory,
  WithdrawTransactionHistory,
  WithrawalProvenOrFinalized,
} from "../types/transaction";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getTokenAddressByChainId } from "@/constant/contracts/tokens";
import { getTransactionConstants } from "../constants/transactionTime";
import { calculateDepositPendingTime } from "../components/new-history-thanos/utils/getTimeDisplay";

const thanosSDK = require("@tokamak-network/thanos-sdk");
export const getThanosMessageStatus = async (
  l1ChainId: SupportedChainId,
  l2ChainId: SupportedChainId,
  txHash: string
): Promise<Status> => {
  const l1Provider = providerByChainId[l1ChainId];
  const l2Provider = providerByChainId[l2ChainId];
  const cm = new thanosSDK.CrossChainMessenger({
    bedrock: true,
    l1ChainId: l1ChainId,
    l2ChainId: l2ChainId,
    l1SignerOrProvider: l1Provider,
    l2SignerOrProvider: l2Provider,
    nativeTokenAddress: getTokenAddressByChainId("TON", l1ChainId),
  });
  const status = await cm.getMessageStatus(txHash);
  switch (status) {
    case 2:
      return Status.Initiated;
    case 3:
      return Status.Prove;
    case 4:
      return Status.Proved;
    case 5:
      return Status.Finalize;
    case 6:
      return Status.Completed;
    default:
      return Status.Initiate;
  }
};

export const getThanosMessageStatuaWithSubgraph = async (
  withdrawalProvens: WithrawalProvenOrFinalized[],
  withdrawalFinalizeds: WithrawalProvenOrFinalized[],
  withdrawalHash: string
) => {
  const challengePeriod = getTransactionConstants(
    SupportedChainId.THANOS_SEPOLIA
  ).WITHDRAW.CHALLENGE_PERIOD;
  if (
    withdrawalFinalizeds.map((tx) => tx.withdrawalHash).includes(withdrawalHash)
  )
    return Status.Completed;
  else if (
    withdrawalProvens.map((tx) => tx.withdrawalHash).includes(withdrawalHash)
  ) {
    const provenTx = withdrawalProvens.find(
      (tx) => tx.withdrawalHash === withdrawalHash
    );
    if (!provenTx) return Status.Proved;
    const remainTime = calculateDepositPendingTime(
      provenTx.blockTimestamp,
      challengePeriod
    );
    return remainTime <= 0 ? Status.Finalize : Status.Proved;
  } else {
    return Status.Prove;
  }
};
