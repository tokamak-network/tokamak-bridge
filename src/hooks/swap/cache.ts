// type TokenGetterFn = (
//   addresses: string[],
//   chainId: SupportedChainId
// ) => Promise<{ [key: string]: Token | undefined }>;
// export function useGetCachedTokens(chains: SupportedChainId[]): TokenGetterFn {
//   const allTokens = useAllTokensMultichain();
//   const multicallContracts = useInterfaceMulticallContracts(chains);
//   const tokenCache = useTokenCache();

//   // Used to fetch tokens not available in local state
//   const fetchRemoteTokens: TokenGetterFn = useCallback(
//     async (addresses, chainId) => {
//       const fetched = await getTokensAsync(
//         addresses,
//         chainId,
//         multicallContracts[chainId]
//       );
//       Object.values(fetched).forEach(tokenCache.set);
//       return fetched;
//     },
//     [multicallContracts, tokenCache]
//   );

//   // Uses tokens from local state if available, otherwise fetches them
//   const getTokens: TokenGetterFn = useCallback(
//     async (addresses, chainId) => {
//       const local: { [address: string]: Token | undefined } = {};
//       const missing = new Set<string>();
//       addresses.forEach((address) => {
//         const cached =
//           tokenCache.get(chainId, address) ?? allTokens[chainId]?.[address];
//         cached ? (local[address] = cached) : missing.add(address);
//       });

//       const fetched = await fetchRemoteTokens([...missing], chainId);
//       return { ...local, ...fetched };
//     },
//     [allTokens, fetchRemoteTokens, tokenCache]
//   );

//   return getTokens;
// }
