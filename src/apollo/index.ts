import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  ApolloLink,
  HttpLink,
  concat,
} from "@apollo/client";
import { MultiAPILink } from "@habx/apollo-multi-endpoint-link";
import { createHttpLink } from "apollo-link-http";
import { SupportedChainId } from "@/types/network/supportedNetwork";

// export const apolloClient = new ApolloClient({
//   uri: process.env.NEXT_PUBLIC_GRAPHQL_API_PRODUCTION,
//   cache: new InMemoryCache(),
// });

// const CHAIN_SUBGRAPH_URL: Record<number, string> = {
//   [SupportedChainId.MAINNET]:
//     "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
//   [SupportedChainId.GOERLI]:
//     "https://api.thegraph.com/subgraphs/name/cd4761/uniswap-v3-goerli",
// };

// const httpLink = new HttpLink({
//   uri: CHAIN_SUBGRAPH_URL[SupportedChainId.MAINNET],
// });

// const authMiddleware = (chainId: number | undefined) =>
//   new ApolloLink((operation, forward) => {
//     // add the authorization to the headers
//     operation.setContext(() => ({
//       uri:
//         chainId && CHAIN_SUBGRAPH_URL[chainId]
//           ? CHAIN_SUBGRAPH_URL[chainId]
//           : CHAIN_SUBGRAPH_URL[SupportedChainId.MAINNET],
//     }));

//     return forward(operation);
//   });

// export const getApolloClient = (chainId: number | undefined) =>
//   new ApolloClient({
//     link: concat(authMiddleware(chainId), httpLink),
//     cache: new InMemoryCache(),
//   });

