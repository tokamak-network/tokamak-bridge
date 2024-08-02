import { useEffect, useMemo } from "react";
import { ApolloError, useQuery } from "@apollo/client";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import {
  FETCH_PROVIDE_LIST_L1,
  FETCH_PROVIDE_LIST_L1_ACCOUNT,
  FETCH_REQUEST_LIST_L2_ACCOUNT,
  FETCH_REQUEST_LIST_L2,
} from "@/graphql/queries/crossTrade";
import { subgraphApolloClientsForCT } from "@/graphql/thegraph/apollosForCT";
import { CrossTradeData } from "../types/crossTrade";
import { isZeroAddress } from "@/utils/contract/isZeroAddress";
import { formatUnits } from "@/utils/trim/convertNumber";
import { useAccount } from "wagmi";
import { isRequestProvided } from "../utils/getRequestStatus";
import { getSupportedTokenForCT } from "@/utils/token/getSupportedTokenInfo";

const getApolloClient = (chainId: number) => {
  return subgraphApolloClientsForCT[chainId];
};

const useGetApolloClient = () => {
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const apolloClient = useMemo(() => {
    if (isConnectedToMainNetwork) {
      return {
        L1_CLIENT: getApolloClient(SupportedChainId.MAINNET),
        L2_CLIENT: getApolloClient(SupportedChainId.TITAN),
      };
    }
    return {
      L1_CLIENT: getApolloClient(SupportedChainId.SEPOLIA),
      L2_CLIENT: getApolloClient(SupportedChainId.TITAN_SEPOLIA),
    };
  }, [isConnectedToMainNetwork]);

  return apolloClient;
};

const errorHandler = (error: ApolloError) => {
  if (error) {
    // Log the error to the console for debugging
    console.error("Apollo Error occurred:", error);

    // Check for GraphQL errors
    if (error.graphQLErrors.length > 0) {
      error.graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }

    // Check for network errors
    if (error.networkError) {
      console.log(`[Network error]: ${error.networkError}`);
    }

    // Here, you can also update your UI accordingly
    // For example, show an error message to the user
  }
};

export type T_FETCH_REQUEST_LIST_L2 = {
  blockTimestamp: string;
  transactionHash: string;
  __typename: string;
  _totalAmount: string;
  _ctAmount: string;
  _hashValue: string;
  _l1token: string;
  _l2token: string;
  _requester: string;
  _saleCount: string;
  _l2chainId: string;
};
export type T_CancelCTs = {
  _saleCount: string;
  blockTimestamp: string;
  transactionHash: string;
};
export type T_FETCH_CancelCTs = T_CancelCTs[];
export type T_ProviderClaimCTs = {
  _saleCount: string;
  _provider: string;
  _l1token: string;
  _l2token: string;
  _requester: string;
  _totalAmount: string;
  _ctAmount: string;
  blockTimestamp: string;
  transactionHash: string;
};
export type T_FETCH_ProviderClaimCTs = T_ProviderClaimCTs[];
export type T_EditCTs = {
  _saleCount: string;
  _requester: string;
  blockTimestamp: string;
  blockNumber: string;
  transactionHash: string;
};
export type T_FETCH_EditCTs = T_EditCTs[];
export type T_provideCTs_L1 = {
  _l1token: string;
  _l2token: string;
  _saleCount: string;
  _requester: string;
  _provider: string;
  _totalAmount: string;
  _ctAmount: string;
  _l2chainId: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
};
export type T_FETCH_ProvideCTs_L1 = T_provideCTs_L1[];

export const useCrossTradeData_L1 = (parmas: { isHistory?: boolean }) => {
  const { isHistory } = parmas;
  const { L1_CLIENT } = useGetApolloClient();
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { address } = useAccount();
  const { data, loading, error } = useQuery<{
    editCTs: T_FETCH_EditCTs;
    provideCTs: T_FETCH_ProvideCTs_L1;
  }>(isHistory ? FETCH_PROVIDE_LIST_L1_ACCOUNT : FETCH_PROVIDE_LIST_L1, {
    pollInterval: 13000,
    client: L1_CLIENT,
    variables: isHistory
      ? {
          account: address as string,
        }
      : undefined,
  });

  return { data, loading, error };
};

export const useCrossTradeData_L2 = (parmas: { isHistory?: boolean }) => {
  const { isHistory } = parmas;
  const { L2_CLIENT } = useGetApolloClient();
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { address } = useAccount();
  const { data, loading, error } = useQuery<{
    requestCTs: T_FETCH_REQUEST_LIST_L2[];
    cancelCTs: T_FETCH_CancelCTs;
    providerClaimCTs: T_FETCH_ProviderClaimCTs;
  }>(isHistory ? FETCH_REQUEST_LIST_L2_ACCOUNT : FETCH_REQUEST_LIST_L2, {
    pollInterval: 13000,
    client: L2_CLIENT,
    variables: isHistory
      ? {
          account: address as string,
        }
      : undefined,
  });

  return { data, loading, error };
};

export const useRequestData = (): {
  requestList: CrossTradeData[] | null;
  isLoading: boolean;
} => {
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { data, error, loading } = useCrossTradeData_L2({ isHistory: false });

  const requestList = useMemo(() => {
    if (error || loading) return null;
    if (data) {
      const datas = data.requestCTs;
      const providerClaimCTs = data.providerClaimCTs;
      const inNetwork = isConnectedToMainNetwork
        ? SupportedChainId.TITAN
        : SupportedChainId.TITAN_SEPOLIA;
      const outNetwork = isConnectedToMainNetwork
        ? SupportedChainId.MAINNET
        : SupportedChainId.SEPOLIA;
      const result: CrossTradeData[] = datas.map((item) => {
        //  will be refactor with split functions
        const tokenInfo = getSupportedTokenForCT(item._l2token);
        const isETH = isZeroAddress(item._l2token);

        const inToken = isETH
          ? {
              address: item._l2token,
              name: "ETH",
              symbol: "ETH",
              amount: item._ctAmount,
              decimals: 18,
            }
          : {
              address: item._l2token,
              name: tokenInfo?.tokenName as string,
              symbol: tokenInfo?.tokenSymbol as string,
              amount: item._ctAmount,
              decimals: tokenInfo?.decimals,
            };

        const outToken = isETH
          ? {
              address: item._l1token,
              name: "ETH",
              symbol: "ETH",
              amount: item._totalAmount,
              decimals: 18,
            }
          : {
              address: item._l1token,
              name: tokenInfo?.tokenName as string,
              symbol: tokenInfo?.tokenSymbol as string,
              amount: item._totalAmount,
              decimals: tokenInfo?.decimals,
            };

        const profitAmount = BigInt(item._totalAmount) - BigInt(item._ctAmount);
        const profitRatio =
          (profitAmount * BigInt(100)) / BigInt(item._totalAmount);
        const isProvided = isRequestProvided({
          providerClaimCTs,
          saleCount: item._saleCount,
        });

        return {
          requester: item._requester,
          inNetwork,
          outNetwork,
          inToken,
          outToken,
          profit: {
            amount: formatUnits(profitAmount.toString(), tokenInfo?.decimals),
            symbol: isETH ? "ETH" : (tokenInfo?.tokenSymbol as string),
            percent: profitRatio.toString(),
            decimals: tokenInfo?.decimals,
          },
          blockTimestamps: Number(item.blockTimestamp),
          isActive: true,
          providingUSD: 1000,
          recevingUSD: 2000,
          subgraphData: item,
          isProvided,
          serviceFee: BigInt(profitAmount.toString()),
        };
      });
      return result;
    }

    return null;
  }, [data, loading, error, isConnectedToMainNetwork]);

  useEffect(() => {
    if (error) {
      errorHandler(error);
    }
  }, [error]);

  return { requestList, isLoading: loading };
};
