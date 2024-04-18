import { supportedChain } from "@/types/network/supportedNetwork";
import useConnectedNetwork from "../network";
import { subgraphApolloClients } from "@/graphql/thegraph/apollo";
import {
  ApolloClient,
  ApolloError,
  NormalizedCacheObject,
} from "@apollo/client";
import { GET_POSITIONS } from "@/graphql/data/queries";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";

export function useApolloClients():
  | ApolloClient<NormalizedCacheObject>[]
  | undefined {
  const { chainGroup } = useConnectedNetwork();

  const clients = chainGroup?.map(
    (chain) => subgraphApolloClients[chain.chainId]
  );

  return clients;
}

export async function useGetPositionByClient(
  client: ApolloClient<NormalizedCacheObject>
) {
  const { address } = useAccount();
  const { data, error, loading } = useQuery(GET_POSITIONS, {
    variables: {
      account: address,
    },
    pollInterval: 10000,
    client,
  });

  return { data, error, loading };
}

export const useGetPositionByClients = () => {
  const clients = useApolloClients();
  const { address } = useAccount();

  const datas = clients?.map((client) =>
    useQuery(GET_POSITIONS, {
      variables: {
        account: address,
      },
      pollInterval: 10000,
      client,
    })
  );
  return { datas };
};
