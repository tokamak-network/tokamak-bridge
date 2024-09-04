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
const CHAIN_SUBGRAPH_URL: Record<number, string[]> = {
  [SupportedChainId.MAINNET]: [
    process.env.NEXT_PUBLIC_SUBGRAPH_ETHEREUM_HISTORY as string,
    process.env.NEXT_PUBLIC_SUBGRAPH_ETHEREUM_HISTORY as string,
  ],
  [SupportedChainId.TITAN]: [
    process.env.NEXT_PUBLIC_SUBGRAPH_TITAN_HISTORY as string,
  ],
  [SupportedChainId.SEPOLIA]: [
    process.env.NEXT_PUBLIC_SUBGRAPH_SEPOLIA_HISTORY as string,
    process.env.NEXT_PUBLIC_SUBGRAPH_SEPOLIA_HISTORY_FOR_THANOS as string,
  ],
  [SupportedChainId.TITAN_SEPOLIA]: [
    process.env.NEXT_PUBLIC_SUBGRAPH_TITAN_SEPOLIA_HISTORY as string,
  ],
  [SupportedChainId.THANOS_SEPOLIA]: [
    process.env.NEXT_PUBLIC_SUBGRAPH_THANOS_HISTORY as string,
  ],
};

const httpLink: Record<number, HttpLink[]> = {
  [SupportedChainId.MAINNET]: CHAIN_SUBGRAPH_URL[SupportedChainId.MAINNET].map(
    (uri) =>
      new HttpLink({
        uri: uri,
      })
  ),
  [SupportedChainId.SEPOLIA]: CHAIN_SUBGRAPH_URL[SupportedChainId.SEPOLIA].map(
    (uri) =>
      new HttpLink({
        uri: uri,
      })
  ),
  [SupportedChainId.TITAN]: CHAIN_SUBGRAPH_URL[SupportedChainId.TITAN].map(
    (uri) =>
      new HttpLink({
        uri: uri,
      })
  ),
  [SupportedChainId.TITAN_SEPOLIA]: CHAIN_SUBGRAPH_URL[
    SupportedChainId.TITAN_SEPOLIA
  ].map(
    (uri) =>
      new HttpLink({
        uri: uri,
      })
  ),
};
// This middleware will allow us to dynamically update the uri for the requests based off chainId
// For more information: https://www.apollographql.com/docs/react/networking/advanced-http-networking/
const authMiddleware = (chainId: SupportedChainId, index: number) =>
  new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext(() => ({
      uri: CHAIN_SUBGRAPH_URL[chainId][index],
    }));

    return forward(operation);
  });

const apolloClient_Ethereum = httpLink[SupportedChainId.MAINNET].map(
  (link, index) =>
    new ApolloClient({
      cache: new InMemoryCache(),
      link: concat(authMiddleware(SupportedChainId.MAINNET, index), link),
    })
);

const apolloClient_Titan = httpLink[SupportedChainId.TITAN].map(
  (link, index) =>
    new ApolloClient({
      cache: new InMemoryCache(),
      link: concat(authMiddleware(SupportedChainId.TITAN, index), link),
    })
);

const apolloClient_Sepolia = httpLink[SupportedChainId.SEPOLIA].map(
  (link, index) =>
    new ApolloClient({
      cache: new InMemoryCache(),
      link: concat(authMiddleware(SupportedChainId.SEPOLIA, index), link),
    })
);
const apolloClient_Titan_Sepolia = httpLink[SupportedChainId.TITAN_SEPOLIA].map(
  (link, index) =>
    new ApolloClient({
      cache: new InMemoryCache(),
      link: concat(authMiddleware(SupportedChainId.TITAN_SEPOLIA, index), link),
    })
);

export const subgraphApolloClientsForHistory: Record<
  number,
  ApolloClient<NormalizedCacheObject>[]
> = {
  [SupportedChainId.MAINNET]: apolloClient_Ethereum,
  [SupportedChainId.TITAN]: apolloClient_Titan,
  [SupportedChainId.SEPOLIA]: apolloClient_Sepolia,
  [SupportedChainId.TITAN_SEPOLIA]: apolloClient_Titan_Sepolia,
};
