import useConnectedNetwork from "../network";
import { subgraphApolloClients } from "@/graphql/thegraph/apollo";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { GET_POSITIONS } from "@/graphql/data/queries";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";

export function useApolloClients():
  | ApolloClient<NormalizedCacheObject>[]
  | undefined {
  const { chainGroup } = useConnectedNetwork();

  return chainGroup?.map((chain) => subgraphApolloClients[chain.chainId]);
}

export const useGetPositionByClients = () => {
  const { address } = useAccount();
  const { chainGroup } = useConnectedNetwork();

  const clients = chainGroup
    ?.map((chain) => subgraphApolloClients[chain.chainId])
    .filter((client) => client !== undefined);

  const response = clients?.map((client) =>
    useQuery(GET_POSITIONS, {
      variables: {
        account: address,
      },
      // pollInterval: 12000,
      client,
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    })
  );

  return { datas: response };
};
