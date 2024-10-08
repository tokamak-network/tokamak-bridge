import {
  THANOS_SEPOLIA_CONTRACTS,
  TOKAMAK_CONTRACTS,
} from "@/constant/contracts";
import { providers, utils } from "ethers";
import L1ThanosUSDCBridgeAbi from "@/constant/abis/L1USDCBridge.json";
import L1ThanosBridgeAbi from "@/abis/L1ThanosStandardBridge.json";
import { ethers } from "ethers";
import {
  ERC20DepositInitiatedTopicHash,
  ETHDepositInitiatedTopicHash,
} from "@/staging/constants/topicHash";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getTokenAddressByChainId } from "@/constant/contracts/tokens";

const l1ThanosUSDCBridgeI = new ethers.utils.Interface(L1ThanosUSDCBridgeAbi);
const l1ThanosBridgeI = new ethers.utils.Interface(L1ThanosBridgeAbi);

export const getDecodedDepositLog = (
  logs: providers.Log[],
  iFace: utils.Interface,
  chainId: SupportedChainId
): {
  l1TokenAddress: string;
  l2TokenAddress: string;
  amount: string;
} | null => {
  const log = logs.find(
    (log: any) =>
      log.topics[0] === ERC20DepositInitiatedTopicHash ||
      log.topics[0] === ETHDepositInitiatedTopicHash
  );
  if (!log) return null;
  const parsedLog = iFace.parseLog(log);
  const { args } = parsedLog;
  const { l1Token, l2Token, _l1Token, _l2Token, amount, _amount } = args;
  return {
    l1TokenAddress: l1Token ?? _l1Token ?? "",
    l2TokenAddress:
      l2Token ?? _l2Token ?? getTokenAddressByChainId("ETH", chainId),
    amount: amount ? amount.toString() : _amount.toString(),
  };
};
