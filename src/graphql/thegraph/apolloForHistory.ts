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

const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [ChainId.MAINNET]:
    "https://thegraph.com/studio/subgraph/tokamak-bridge-history/",
  [SupportedChainId.TITAN]:
    "https://thegraph.titan.tokamak.network/subgraphs/name/tokamak/titan-uniswap-subgraph",
  //   [SupportedChainId.SEPOLIA]:
  //     "https://api.studio.thegraph.com/query/49678/tokamak-uniswapv3/version/latest",
  //   [SupportedChainId.TITAN_SEPOLIA]:
  //     "https://graph-node.titan-sepolia.tokamak.network/subgraphs/name/tokamak/titan-sepolia-uniswap-subgraph",
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

const apolloClient_Ethereum = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware(SupportedChainId.MAINNET), httpLink),
});

const apolloClient_Titan = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware(SupportedChainId.TITAN), httpLink),
});

// const apolloClient_Sepolia = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: concat(authMiddleware(SupportedChainId.SEPOLIA), httpLink),
// });

// const apolloClient_Titan_Sepolia = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: concat(authMiddleware(SupportedChainId.TITAN_SEPOLIA), httpLink),
// });

export const subgraphApolloClientsForHistory: Record<
  number,
  ApolloClient<NormalizedCacheObject>
> = {
  [SupportedChainId.MAINNET]: apolloClient_Ethereum,
  [SupportedChainId.TITAN]: apolloClient_Titan,
  //   [SupportedChainId.SEPOLIA]: apolloClient_Sepolia,
  //   [SupportedChainId.TITAN_SEPOLIA]: apolloClient_Titan_Sepolia,
};
