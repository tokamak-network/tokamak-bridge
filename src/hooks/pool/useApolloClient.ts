import { supportedChain } from "@/types/network/supportedNetwork";
import useConnectedNetwork from "../network";
import { subgraphApolloClients } from "@/graphql/thegraph/apollo";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { GET_POSITIONS } from "@/graphql/data/queries";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";

export function useApolloClients():
  | ApolloClient<NormalizedCacheObject>[]
  | undefined {
  const { connectedChainId, otherLayerChainInfo, chainGroup } =
    useConnectedNetwork();

  const clients = chainGroup?.map(
    (chain) => subgraphApolloClients[chain.chainId]
  );

  return clients;
}

export function useGetPosition(client: ApolloClient<NormalizedCacheObject>) {
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
