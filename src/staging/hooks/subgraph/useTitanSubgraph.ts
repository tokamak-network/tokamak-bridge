import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { errorHandler, useGetApolloClient } from "./useApolloClient";
import useConnectedNetwork from "@/hooks/network";
import { useRecoilState } from "recoil";
import { titanDepositHistory } from "@/recoil/history/transaction";
import { MAINNET_CONTRACTS, SEPOLIA_CONTRACTS } from "@/constant/contracts";
import { FETCH_USER_TRANSACTIONS_L1_TITAN, FETCH_USER_TRANSACTIONS_L2 } from "@/graphql/queries/history";
import { useQuery } from "@apollo/client";
import { formatAddress } from "@/utils/trim/formatAddress";
import { getTitanDepositMsgHashes } from "@/utils/history/getCurrentStatus";
import { GET_RelayedMessages } from "@/graphql/data/queries";

export const useTitanSubgraph = () => {
  const { address } = useAccount();
  const [pollCount, setPollCount] = useState<number>(0);
  const { L1_CLIENT, L2_TITAN_CLIENT } = useGetApolloClient();
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  const [titanDipositHistory, setTitanDipositHistory] =
    useRecoilState(titanDepositHistory);

  const L1Bridge = isConnectedToMainNetwork
    ? MAINNET_CONTRACTS.L1Bridge
    : SEPOLIA_CONTRACTS.L1Bridge_TITAN_SEPOLIA;

  useEffect(() => {
    setPollCount(0);
    const refetchDepositHistory = async () => {
      refetchL1TitanData();
      refetchL2TitanRelayedMessage();
    }
    const refetchWithdrawHistory = async () => {
      refetchL2TitanData();
    }
    const interval = setInterval(() => {
      setPollCount(prev => prev + 1);
      refetchDepositHistory();
      refetchWithdrawHistory();
    }, 12000);
    return () => clearInterval(interval);
  }, [])
  const {
    data: _l1TitanData,
    loading: _l1TitanLoading,
    error: _l1TitanError,
    refetch: refetchL1TitanData
  } = useQuery(FETCH_USER_TRANSACTIONS_L1_TITAN, {
    variables: {
      formattedAddress: formatAddress(address),
      L1Bridge,
      account: address,
      blockNumber: titanDipositHistory.latestRelayedBlockNumber,
    },
    client: L1_CLIENT[0],
  });

  const l1TitanDepositSentMessages = !_l1TitanData
    ? null
    : _l1TitanData?.sentMessages ?? [];
  const l1TitanDepositMessageHashes = getTitanDepositMsgHashes(
    l1TitanDepositSentMessages,
  );
  const {
    data: _l2TitanRelayedMessageData,
    loading: _l2TitanRelayedMessageLoading,
    error: _l2TitanRelayedMessageError,
    refetch: refetchL2TitanRelayedMessage
  } = useQuery(GET_RelayedMessages, {
    variables: {
      msgHashes: l1TitanDepositMessageHashes,
    },
    client: L2_TITAN_CLIENT[0],
    skip: !l1TitanDepositMessageHashes,
  });
  const {
    data: _l2Titan,
    loading: _l2TitanLoading,
    error: _l2TitanError,
    refetch: refetchL2TitanData
  } = useQuery(FETCH_USER_TRANSACTIONS_L2, {
    variables: {
      formattedAddress: formatAddress(address),
      L1Bridge,
      account: address,
    },
    client: L2_TITAN_CLIENT[0],
  });

  useEffect(() => {
    if (_l1TitanError) {
      errorHandler(_l1TitanError);
    }
    if (_l2TitanError) {
      errorHandler(_l2TitanError);
    }
    if (_l2TitanRelayedMessageError) {
      errorHandler(_l2TitanRelayedMessageError);
    }
  }, [
    _l1TitanError,
    _l2TitanError,
  ]);
  return {
    l1TitanData: _l1TitanData,
    l1TitanLoading: _l1TitanLoading,
    l1Titanerror: _l1TitanError,
    l2TitanData: _l2Titan,
    l2TitanRelayedMessages: _l2TitanRelayedMessageData,
    pollCount
  };
};