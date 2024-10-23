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
  [SupportedChainId.MAINNET]: process.env
    .NEXT_PUBLIC_SUBGRAPH_ETHEREUM_HISTORY as string,
  [SupportedChainId.TITAN]: process.env
    .NEXT_PUBLIC_SUBGRAPH_TITAN_HISTORY as string,
  [SupportedChainId.SEPOLIA]: process.env
    .NEXT_PUBLIC_SUBGRAPH_SEPOLIA_HISTORY as string,
  [SupportedChainId.TITAN_SEPOLIA]: process.env
    .NEXT_PUBLIC_SUBGRAPH_TITAN_SEPOLIA_HISTORY as string,
};

const httpLink: Record<number, HttpLink> = {
  [SupportedChainId.MAINNET]: new HttpLink({
    uri: CHAIN_SUBGRAPH_URL[SupportedChainId.MAINNET],
  }),
  [SupportedChainId.SEPOLIA]: new HttpLink({
    uri: CHAIN_SUBGRAPH_URL[SupportedChainId.SEPOLIA],
  }),
  [SupportedChainId.TITAN]: new HttpLink({
    uri: CHAIN_SUBGRAPH_URL[SupportedChainId.TITAN],
  }),
  [SupportedChainId.TITAN_SEPOLIA]: new HttpLink({
    uri: CHAIN_SUBGRAPH_URL[SupportedChainId.TITAN_SEPOLIA],
  }),
};
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

const apolloClient_Ethereum = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(
    authMiddleware(SupportedChainId.MAINNET),
    httpLink[SupportedChainId.MAINNET]
  ),
});

const apolloClient_Titan = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(
    authMiddleware(SupportedChainId.TITAN),
    httpLink[SupportedChainId.TITAN]
  ),
});

const apolloClient_Sepolia = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(
    authMiddleware(SupportedChainId.SEPOLIA),
    httpLink[SupportedChainId.SEPOLIA]
  ),
});

const apolloClient_Titan_Sepolia = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(
    authMiddleware(SupportedChainId.TITAN_SEPOLIA),
    httpLink[SupportedChainId.TITAN_SEPOLIA]
  ),
});

export const subgraphApolloClientsForHistory: Record<
  number,
  ApolloClient<NormalizedCacheObject>
> = {
  [SupportedChainId.MAINNET]: apolloClient_Ethereum,
  [SupportedChainId.TITAN]: apolloClient_Titan,
  [SupportedChainId.SEPOLIA]: apolloClient_Sepolia,
  [SupportedChainId.TITAN_SEPOLIA]: apolloClient_Titan_Sepolia,
};
