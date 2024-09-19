import { providerByChainId } from "@/config/getProvider";
import { Status, TransactionHistory } from "../types/transaction";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getTokenAddressByChainId } from "@/constant/contracts/tokens";

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
