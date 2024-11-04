import { providers, utils } from "ethers";
import {
  ERC20DepositInitiatedTopicHash,
  ETHDepositInitiatedTopicHash,
  WithdrawalInitiatedTopicHash,
} from "@/staging/constants/topicHash";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getTokenAddressByChainId } from "@/constant/contracts/tokens";
import {
  TOKAMAK_CONTRACTS,
  SEPOLIA_CONTRACTS,
  THANOS_SEPOLIA_CONTRACTS,
} from "@/constant/contracts";
import { isThanosChain } from "../network/checkNetwork";
import { ZERO_ADDRESS } from "@/constant/misc";

export const getDecodedStandardBridgeLog = (
  logs: providers.Log[],
  iFace: utils.Interface,
  chainId: SupportedChainId
): {
  l1TokenAddress: string;
  l2TokenAddress: string;
  amount: string;
  from?: string;
  to?: string;
} | null => {
  const log = logs.find(
    (log: any) =>
      log.topics[0] === ERC20DepositInitiatedTopicHash ||
      log.topics[0] === ETHDepositInitiatedTopicHash ||
      log.topics[0] === WithdrawalInitiatedTopicHash
  );
  if (!log) return null;
  const parsedLog = iFace.parseLog(log);
  const { args } = parsedLog;
  const {
    l1Token,
    l2Token,
    _l1Token,
    _l2Token,
    amount,
    _amount,
    from,
    to,
    _from,
    _to,
  } = args;
  return {
    l1TokenAddress:
      isThanosChain(chainId) &&
      l1Token &&
      l2Token &&
      l1Token.toLowerCase() == ZERO_ADDRESS &&
      l2Token.toLowerCase() == THANOS_SEPOLIA_CONTRACTS.TON_ADDRESS
        ? SEPOLIA_CONTRACTS.TON_ADDRESS
        : l1Token ?? _l1Token ?? "",
    l2TokenAddress:
      l2Token ?? _l2Token ?? getTokenAddressByChainId("ETH", chainId),
    amount: amount ? amount.toString() : _amount.toString(),
    from: from ?? _from,
    to: to ?? _to,
  };
};
