import { subgraphApolloClientsForHistory } from "@/graphql/thegraph/apolloForHistory";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { ApolloError } from "@apollo/client";
import { useMemo } from "react";

const getApolloClient = (chainId: number) => {
  return subgraphApolloClientsForHistory[chainId];
};

export const useGetApolloClient = () => {
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const apolloClient = useMemo(() => {
    if (isConnectedToMainNetwork) {
      return {
        L1_CLIENT: getApolloClient(SupportedChainId.MAINNET),
        L2_TITAN_CLIENT: getApolloClient(SupportedChainId.TITAN),
        L2_THANOS_CLIENT: getApolloClient(SupportedChainId.THANOS_SEPOLIA), // need to update when thanos main net comes out
      };
    }
    return {
      L1_CLIENT: getApolloClient(SupportedChainId.SEPOLIA),
      L2_TITAN_CLIENT: getApolloClient(SupportedChainId.TITAN_SEPOLIA),
      L2_THANOS_CLIENT: getApolloClient(SupportedChainId.THANOS_SEPOLIA),
    };
  }, [isConnectedToMainNetwork]);

  return apolloClient;
};

export const errorHandler = (error: ApolloError) => {
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