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
import * as GraphClient from "../../.graphclient";
import { SupportedChainId } from "@/types/network/supportedNetwork";

// export const apolloClient = new ApolloClient({
//   uri: process.env.NEXT_PUBLIC_GRAPHQL_API_PRODUCTION,
//   cache: new InMemoryCache(),
// });

const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [SupportedChainId.MAINNET]:
    "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
  [SupportedChainId.TITAN]:
    "https://thegraph.titan.tokamak.network/subgraphs/name/cd4761/uniswapv3-tokamak/graphql",
};

const httpLink = new HttpLink({
  uri: CHAIN_SUBGRAPH_URL[1],
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const chainId = 55004;

  operation.setContext(() => ({
    uri:
      chainId && CHAIN_SUBGRAPH_URL[chainId]
        ? CHAIN_SUBGRAPH_URL[chainId]
        : CHAIN_SUBGRAPH_URL[SupportedChainId.MAINNET],
  }));

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});

// export const apolloClient = new ApolloClient({
//   link: ApolloLink.from([
//     new MultiAPILink({
//       endpoints: {
//         tosv2: process.env.NEXT_PUBLIC_GRAPHQL_API_PRODUCTION as string,
//         titanSubGraph: process.env.NEXT_PUBLIC_SUBGRAPH_TITAN as string,
//         titanGoerliSubGraph: process.env
//           .NEXT_PUBLIC_SUBGRAPH_TITAN_GOERLI as string,
//       },
//       //@ts-ignore
//       createHttpLink: () => createHttpLink(),
//     }),
//   ]),
//   cache: new InMemoryCache(),
// });
