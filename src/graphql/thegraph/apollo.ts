import {
  supportedChain,
  SupportedChainId,
} from "@/types/network/supportedNetwork";
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
    "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3?source=uniswap",
  // [ChainId.ARBITRUM_ONE]:
  //   "https://thegraph.com/hosted-service/subgraph/ianlapham/uniswap-arbitrum-one",
  // [ChainId.OPTIMISM]:
  //   "https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis",
  // [ChainId.POLYGON]:
  //   "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
  // [ChainId.CELO]:
  //   "https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo",
  // [ChainId.BNB]:
  //   "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-bsc",
  // [ChainId.AVALANCHE]:
  //   "https://api.thegraph.com/subgraphs/name/lynnshaoyu/uniswap-v3-avax",
  // "https://api.thegraph.com/subgraphs/name/liqwiz/uniswap-v3-goerli",
  [SupportedChainId.TITAN]:
    "https://thegraph.titan.tokamak.network/subgraphs/name/tokamak/titan-uniswap-subgraph",
  [SupportedChainId.SEPOLIA]:
    "https://api.studio.thegraph.com/query/49678/tokamak-uniswapv3/version/latest",
  [SupportedChainId.TITAN_SEPOLIA]:
    "https://graph-node.titan-sepolia.tokamak.network/subgraphs/name/tokamak/titan-sepolia-uniswap-subgraph",
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

const apolloClient_ethereum = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware(SupportedChainId.MAINNET), httpLink),
});

const apolloClient_Titan = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware(SupportedChainId.TITAN), httpLink),
});

const apolloClient_Sepolia = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware(SupportedChainId.SEPOLIA), httpLink),
});

const apolloClient_Titan_Sepolia = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware(SupportedChainId.TITAN_SEPOLIA), httpLink),
});

export const subgraphApolloClients: Record<
  number,
  ApolloClient<NormalizedCacheObject>
> = {
  [SupportedChainId.MAINNET]: apolloClient_ethereum,
  [SupportedChainId.TITAN]: apolloClient_Titan,
  [SupportedChainId.SEPOLIA]: apolloClient_Sepolia,
  // [SupportedChainId.THANOS_SEPOLIA]: apolloClient_Sepolia,
  [SupportedChainId.TITAN_SEPOLIA]: apolloClient_Titan_Sepolia,
};
