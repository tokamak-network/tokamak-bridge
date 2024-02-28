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

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    new MultiAPILink({
      endpoints: {
        price: process.env.NEXT_PUBLIC_PRICE_API as string,
        l1BridgeGoerli: process.env.NEXT_PUBLIC_L1BRIDGE_GOERLI as string,
        l1BridgeMainnet: process.env.NEXT_PUBLIC_L1BRIDGE_MAINNET as string,
        l2BridgeTitanGoerli: process.env
          .NEXT_PUBLIC_L2MESSENGER_TITAN_GOERLI as string,
        l2BridgeTitan: process.env.NEXT_PUBLIC_L2MESSENGER_TITAN as string,
        titanSubGraph: process.env.NEXT_PUBLIC_SUBGRAPH_TITAN as string,
        titanGoerliSubGraph: process.env
          .NEXT_PUBLIC_SUBGRAPH_TITAN_GOERLI as string,
      },
      //@ts-ignore
      createHttpLink: () => createHttpLink(),
    }),
  ]),
  cache: new InMemoryCache(),
});
