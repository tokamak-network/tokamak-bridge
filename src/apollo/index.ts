import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  ApolloLink,
} from "@apollo/client";
import { MultiAPILink } from "@habx/apollo-multi-endpoint-link";
import { createHttpLink } from "apollo-link-http";

// export const apolloClient = new ApolloClient({
//   uri: process.env.NEXT_PUBLIC_GRAPHQL_API_PRODUCTION,
//   cache: new InMemoryCache(),
// });

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    new MultiAPILink({
      endpoints: {
        tosv2: process.env.NEXT_PUBLIC_GRAPHQL_API_PRODUCTION as string,
        titanSubGraph: process.env.NEXT_PUBLIC_SUBGRAPH_TITAN as string,
      },
      //@ts-ignore
      createHttpLink: () => createHttpLink(),
    }),
  ]),
  cache: new InMemoryCache(),
});
