import { SupportedChainId } from "@/types/network/supportedNetwork";
import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { ChainId } from "@uniswap/sdk-core";

/**
 * For Standard Bridge History Subgraphs
 */
const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [ChainId.MAINNET]: process.env
    .NEXT_PUBLIC_SUBGRAPH_ETHEREUM_CROSSTRADE as string,
  [SupportedChainId.TITAN]: process.env
    .NEXT_PUBLIC_SUBGRAPH_TITAN_CROSSTRADE as string,
  [SupportedChainId.SEPOLIA]: process.env
    .NEXT_PUBLIC_SUBGRAPH_SEPOLIA_CROSSTRADE as string,
  [SupportedChainId.TITAN_SEPOLIA]: process.env
    .NEXT_PUBLIC_SUBGRAPH_TITAN_SEPOLIA_CROSSTRADE as string,
};

const httpLink = new HttpLink({ uri: CHAIN_SUBGRAPH_URL[ChainId.MAINNET] });
// This middleware will allow us to dynamically update the uri for the requests based off chainId
// For more information: https://www.apollographql.com/docs/react/networking/advanced-http-networking/
const authMiddleware = (chainId: SupportedChainId) =>
  new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext(() => ({
      uri: CHAIN_SUBGRAPH_URL[chainId],
    }));

    return forward(operation);
  });

const cacheL1 = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        requestCTs: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        cancelCTs: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        providerClaimCTs: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const apolloClient_Ethereum = new ApolloClient({
  cache: cacheL1,
  link: concat(authMiddleware(SupportedChainId.MAINNET), httpLink),
});

const apolloClient_Titan = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware(SupportedChainId.TITAN), httpLink),
});

const apolloClient_Sepolia = new ApolloClient({
  cache: cacheL1,
  link: concat(authMiddleware(SupportedChainId.SEPOLIA), httpLink),
});

const apolloClient_Titan_Sepolia = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware(SupportedChainId.TITAN_SEPOLIA), httpLink),
});

export const subgraphApolloClientsForCT: Record<
  number,
  ApolloClient<NormalizedCacheObject>
> = {
  [SupportedChainId.MAINNET]: apolloClient_Ethereum,
  [SupportedChainId.TITAN]: apolloClient_Titan,
  [SupportedChainId.SEPOLIA]: apolloClient_Sepolia,
  [SupportedChainId.TITAN_SEPOLIA]: apolloClient_Titan_Sepolia,
};
