import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import {
  SEPOLIA_CONTRACTS,
  THANOS_SEPOLIA_CONTRACTS,
} from "@/constant/contracts";
import {
  FETCH_USER_TRANSACTIONS_L1_THANOS,
  FETCH_USER_TRANSACTIONS_L2_THANOS,
} from "@/graphql/queries/history";
import {
  getThanosDepositMsgHashes,
} from "@/utils/history/getCurrentStatus";
import { formatAddress } from "@/utils/trim/formatAddress";
import { useRecoilState } from "recoil";
import {
  thanosDepositHistory,
} from "@/recoil/history/transaction";
import {
  GET_RelayedMessages,
  GET_SentMessageExtensions,
  GET_withdrawalProvens_withdrawalFinalizeds,
} from "@/graphql/data/queries";
import { errorHandler, useGetApolloClient } from "./useApolloClient";

export const useThanosSubgraph = () => {
  const { address } = useAccount();
  const [pollCount, setPollCount] = useState<number>(0);
  const { L1_CLIENT, L2_THANOS_CLIENT } = useGetApolloClient();
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const [thanosDipositHistory, setThanosDipositHistory] =
    useRecoilState(thanosDepositHistory);

  const L1StandardBridgeForThanos = SEPOLIA_CONTRACTS.L1Bridge_THANOS_SEPOLIA;
  const L1USDCBridgeForThanos = SEPOLIA_CONTRACTS.L1USDCBridge_THANOS_SEPOLIA;
  useEffect(() => {
    setPollCount(0);
    const refetchDepositHistory = async () => {
      if (isConnectedToMainNetwork) return;
      await refetchL1ThanosData();
      await refetchL1ThanosSentMessageExtensions();
      await refetchL2ThanosRelayedMessage();
    }
    const refetchWithdrawHistory = async () => {
      if (isConnectedToMainNetwork) return;
      await refetchL1ThanosData();
      await refetchL2Thanos();
      await refetchL1ThanosOptimismPortal();
    }
    const interval = setInterval(() => {
      setPollCount(prev => prev + 1);
      refetchDepositHistory();
      refetchWithdrawHistory();
    }, 12000);
    return () => clearInterval(interval);
  }, [])

  const {
    data: _l1ThanosData,
    loading: _l1ThanosLoading,
    error: _l1ThanosError,
    refetch: refetchL1ThanosData
  } = useQuery(FETCH_USER_TRANSACTIONS_L1_THANOS, {
    variables: {
      formattedAddress: formatAddress(address),
      L1StandardBridge: L1StandardBridgeForThanos,
      L1UsdcBridge: L1USDCBridgeForThanos,
      account: address,
      remoteToken: THANOS_SEPOLIA_CONTRACTS.TON_ADDRESS,
      blockNumber: thanosDipositHistory.latestRelayedBlockNumber,
    },
    skip: isConnectedToMainNetwork,
    client: L1_CLIENT[1],
  });

  const l1ThanosDepositSentMessages = !_l1ThanosData
    ? null
    : _l1ThanosData?.sentMessages ?? [];
  const l1ThanosDepositTxHashes = !l1ThanosDepositSentMessages
    ? null
    : l1ThanosDepositSentMessages.map((msg: any) => msg.transactionHash);

  const {
    data: _l1ThanosSentMessageExtensionsData,
    loading: _l1ThanosSentMessageExtensionsLoading,
    error: _l1ThanosSentMessageExtensionsError,
    refetch: refetchL1ThanosSentMessageExtensions
  } = useQuery(GET_SentMessageExtensions, {
    variables: {
      transactionHashes: l1ThanosDepositTxHashes,
      blockNumber: thanosDipositHistory.latestRelayedBlockNumber,
    },
    client: L1_CLIENT[1],
    skip: !l1ThanosDepositTxHashes || isConnectedToMainNetwork,
  });

  const l1ThanosDepositMessageHashes = getThanosDepositMsgHashes(
    l1ThanosDepositSentMessages,
    _l1ThanosSentMessageExtensionsData?.sentMessageExtension1S ?? []
  );

  const {
    data: _l2ThanosRelayedMessageData,
    loading: _l2ThanosRelayedMessageLoading,
    error: _l2ThanosRelayedMessageError,
    refetch: refetchL2ThanosRelayedMessage
  } = useQuery(GET_RelayedMessages, {
    variables: {
      msgHashes: l1ThanosDepositMessageHashes,
    },

    client: L2_THANOS_CLIENT[0],
    skip: !l1ThanosDepositMessageHashes || isConnectedToMainNetwork,
  });

  const {
    data: _l2Thanos,
    loading: _l2ThanosLoading,
    error: _l2ThanosError,
    refetch: refetchL2Thanos
  } = useQuery(FETCH_USER_TRANSACTIONS_L2_THANOS, {
    variables: {
      formattedAddress: formatAddress(address),
      L1StandardBridge: L1StandardBridgeForThanos,
      account: address,
    },
    skip: isConnectedToMainNetwork,
    client: L2_THANOS_CLIENT[0],
  });

  const messagePasseds = _l2Thanos?.messagePasseds ?? [];

  const withdrawalHashes = messagePasseds.map((msg: any) => msg.withdrawalHash);
  const {
    data: _l1ThanosOptimismPortal,
    loading: _l1ThanosOptimismPortalLoading,
    error: _l1ThanosOptimismPortalError,
    refetch: refetchL1ThanosOptimismPortal
  } = useQuery(GET_withdrawalProvens_withdrawalFinalizeds, {
    variables: { withdrawalHashes: withdrawalHashes },
    skip: isConnectedToMainNetwork,
    client: L1_CLIENT[1],
  });

  useEffect(() => {
    if (_l1ThanosError) {
      errorHandler(_l1ThanosError);
    }
    if (_l2ThanosError) {
      errorHandler(_l2ThanosError);
    }
    if (_l1ThanosOptimismPortalError) {
      errorHandler(_l1ThanosOptimismPortalError);
    }
    if (_l1ThanosSentMessageExtensionsError) {
      errorHandler(_l1ThanosSentMessageExtensionsError);
    }
    if (_l2ThanosRelayedMessageError) {
      errorHandler(_l2ThanosRelayedMessageError);
    }
  }, [
    _l2ThanosError,
    _l1ThanosOptimismPortalError,
    _l1ThanosSentMessageExtensionsError,
    _l2ThanosRelayedMessageError,
  ]);
  return {
    l1ThanosData: _l1ThanosData,
    l1ThanosLoading: _l1ThanosLoading,
    l1Thanoserror: _l1ThanosError,
    l2ThanosData: _l2Thanos,
    l1ThanosOptimismPortal: _l1ThanosOptimismPortal,
    l1ThanosSentMsgExtensions: _l1ThanosSentMessageExtensionsData,
    l2ThanosRelayedMessages: _l2ThanosRelayedMessageData,
    pollCount
  };
};