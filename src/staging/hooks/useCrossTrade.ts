import { useEffect, useMemo } from "react";
import { ApolloError, useQuery } from "@apollo/client";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { FETCH_REQUEST_LIST_L2 } from "@/graphql/queries/crossTrade";
import { subgraphApolloClientsForCT } from "@/graphql/thegraph/apollosForCT";
import { CrossTradeData } from "../types/crossTrade";
import { supportedTokensForCT } from "@/types/token/supportedToken";
import { isZeroAddress } from "@/utils/contract/isZeroAddress";

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
  __typename: string;
  _ctAmount: string;
  _hashValue: string;
  _l1token: string;
  _l2token: string;
  _requester: string;
  _saleCount: string;
  _totalAmount: string;
  _l2chainId: string;
};

export const useRequestData = (): {
  requestList: CrossTradeData[] | null;
  isLoading: boolean;
} => {
  const { L2_CLIENT } = useGetApolloClient();
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { data, loading, error } = useQuery<{
    requestCTs: T_FETCH_REQUEST_LIST_L2[];
  }>(FETCH_REQUEST_LIST_L2, {
    pollInterval: 13000,
    client: L2_CLIENT,
  });

  const requestList = useMemo(() => {
    if (error || loading) return null;
    if (data) {
      const datas = data.requestCTs;

      const inNetwork = isConnectedToMainNetwork
        ? SupportedChainId.TITAN
        : SupportedChainId.TITAN_SEPOLIA;
      const outNetwork = isConnectedToMainNetwork
        ? SupportedChainId.MAINNET
        : SupportedChainId.SEPOLIA;
      const result: CrossTradeData[] = datas.map((item) => {
        //  will be refactor with split functions
        const test = supportedTokensForCT
          .map((token) => {
            const supportedAddresses = Object.values(token.address);
            return supportedAddresses.includes(item._l2token) ? token : null;
          })
          .filter((item) => item !== null)[0];
        const inToken = isZeroAddress(item._l2token)
          ? {
              address: item._l2token,
              name: "ETH",
              symbol: "ETH",
              amount: item._totalAmount,
              decimals: 18,
            }
          : {
              address: item._l2token,
              name: test?.tokenName as string,
              symbol: test?.tokenSymbol as string,
              amount: item._totalAmount,
              decimals: 18,
            };

        const outToken = isZeroAddress(item._l2token)
          ? {
              address: item._l1token,
              name: "ETH",
              symbol: "ETH",
              amount: item._totalAmount,
              decimals: 18,
            }
          : {
              address: item._l1token,
              name: test?.tokenName as string,
              symbol: test?.tokenSymbol as string,
              amount: item._totalAmount,
              decimals: 18,
            };

        return {
          requester: item._requester,
          inNetwork,
          outNetwork,
          inToken,
          outToken,
          profit: {
            amount: item._totalAmount,
            symbol: "ETH",
            percent: "100",
            decimals: 18,
          },
          blockTimestamps: Number(item.blockTimestamp),
          isActive: true,
          providingUSD: 100,
          recevingUSD: 100,
          subgraphData: item,
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
