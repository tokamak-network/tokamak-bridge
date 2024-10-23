import { useCallback, useEffect, useMemo, useState } from "react";
import { ApolloError, useQuery } from "@apollo/client";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import {
  FETCH_PROVIDE_LIST_L1,
  FETCH_PROVIDE_LIST_L1_ACCOUNT,
  FETCH_REQUEST_LIST_L2_ACCOUNT,
  FETCH_REQUEST_LIST_L2,
} from "@/graphql/queries/crossTrade";
import { subgraphApolloClientsForCT } from "@/graphql/thegraph/apollosForCT";
import { CrossTradeData } from "../types/crossTrade";
import { isZeroAddress } from "@/utils/contract/isZeroAddress";
import { formatUnits } from "@/utils/trim/convertNumber";
import { useAccount } from "wagmi";
import {
  getEditCTTransaction,
  isRequestCanceled,
  isRequestEdited,
  isRequestProvided,
  isRequestProvidedOnL1,
} from "../utils/getRequestStatus";
import { getSupportedTokenForCT } from "@/utils/token/getSupportedTokenInfo";
import { getCTTokenPrice } from "../utils/getCTTokenPrice";
import { useProvideCTGas } from "../components/cross-trade/hooks/useCTGas";
import commafy from "@/utils/trim/commafy";
import { parseUnits } from "ethers/lib/utils";
import Decimal from "decimal.js";
import { formatNumber } from "@uniswap/conedison/format";

const getApolloClient = (chainId: number) => {
  return subgraphApolloClientsForCT[chainId];
};

const useGetApolloClient = () => {
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const apolloClient = useMemo(() => {
    if (isConnectedToMainNetwork || isConnectedToMainNetwork === undefined) {
      return {
        L1_CLIENT: getApolloClient(SupportedChainId.MAINNET),
        L2_CLIENT: getApolloClient(SupportedChainId.TITAN),
      };
    }
    return {
      L1_CLIENT: getApolloClient(SupportedChainId.SEPOLIA),
      L2_CLIENT: getApolloClient(SupportedChainId.TITAN_SEPOLIA),
    };
  }, [isConnectedToMainNetwork]);

  return apolloClient;
};

const errorHandler = (error: ApolloError) => {
  if (error) {
    // Log the error to the console for debugging
    console.error("Apollo Error occurred:", error);

    // Check for GraphQL errors
    if (error.graphQLErrors.length > 0) {
      error.graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }

    // Check for network errors
    if (error.networkError) {
      console.log(`[Network error]: ${error.networkError}`);
    }

    // Here, you can also update your UI accordingly
    // For example, show an error message to the user
  }
};

export type T_FETCH_REQUEST_LIST_L2 = {
  blockTimestamp: string;
  transactionHash: string;
  __typename: string;
  _totalAmount: string;
  _ctAmount: string;
  _hashValue: string;
  _l1token: string;
  _l2token: string;
  _requester: string;
  _saleCount: string;
  _l2chainId: string;
};
export type T_CancelCTs = {
  _saleCount: string;
  blockTimestamp: string;
  transactionHash: string;
};
export type T_FETCH_CancelCTs = T_CancelCTs[];
export type T_ProviderClaimCTs = {
  _saleCount: string;
  _provider: string;
  _l1token: string;
  _l2token: string;
  _requester: string;
  _totalAmount: string;
  _ctAmount: string;
  blockTimestamp: string;
  transactionHash: string;
};
export type T_FETCH_ProviderClaimCTs = T_ProviderClaimCTs[];
export type T_EditCTs = {
  _saleCount: string;
  _requester: string;
  _ctAmount: string;
  blockTimestamp: string;
  blockNumber: string;
  transactionHash: string;
};
export type T_FETCH_EditCTs = T_EditCTs[];
export type T_provideCTs_L1 = {
  _l1token: string;
  _l2token: string;
  _saleCount: string;
  _requester: string;
  _provider: string;
  _totalAmount: string;
  _ctAmount: string;
  _l2chainId: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
};
export type T_FETCH_ProvideCTs_L1 = T_provideCTs_L1[];
export type T_CancelCT_L1 = {
  _saleCount: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
};
export type T_FETCH_CancelCTs_L1 = T_CancelCT_L1[];

export const useCrossTradeData_L1 = (parmas: { isHistory?: boolean }) => {
  const { isHistory } = parmas;
  const { L1_CLIENT } = useGetApolloClient();
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { address } = useAccount();
  const { data, loading, error } = useQuery<{
    editCTs: T_FETCH_EditCTs;
    provideCTs: T_FETCH_ProvideCTs_L1;
    l1CancelCTs: T_FETCH_CancelCTs_L1;
  }>(isHistory ? FETCH_PROVIDE_LIST_L1_ACCOUNT : FETCH_PROVIDE_LIST_L1, {
    pollInterval: 5000,
    client: L1_CLIENT,
    variables: isHistory
      ? {
        account: address as string,
      }
      : undefined,
  });

  return { data, loading, error };
};

export const useCrossTradeData_L2 = (parmas: { isHistory?: boolean }) => {
  const { isHistory } = parmas;
  const { L2_CLIENT } = useGetApolloClient();
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { address } = useAccount();
  const { data, loading, error } = useQuery<{
    requestCTs: T_FETCH_REQUEST_LIST_L2[];
    cancelCTs: T_FETCH_CancelCTs;
    providerClaimCTs: T_FETCH_ProviderClaimCTs;
  }>(isHistory ? FETCH_REQUEST_LIST_L2_ACCOUNT : FETCH_REQUEST_LIST_L2, {
    pollInterval: 5000,
    client: L2_CLIENT,
    variables: isHistory
      ? {
        account: address,
      }
      : undefined,
  });

  return { data, loading, error };
};

export const useRequestData = (
  saleCount?: string
): {
  requestList: CrossTradeData[] | null;
  isLoading: boolean;
  l2RelayQueue: string[] | undefined;
  requestDataBySaleCount: CrossTradeData | undefined;
} => {
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { data, error, loading } = useCrossTradeData_L2({ isHistory: false });
  const {
    data: _l1Data,
    error: _l1Error,
    loading: _l1Loading,
  } = useCrossTradeData_L1({ isHistory: false });
  const [requestList, setRequestList] = useState<CrossTradeData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { provideCTTxnCost } = useProvideCTGas();
  const fetchRequestList = useCallback(async () => {
    try {
      if (error || _l1Error) return null;
      if (data && _l1Data) {
        const datas = data.requestCTs;
        const providerClaimCTs = data.providerClaimCTs;
        const cancelCTs = _l1Data.l1CancelCTs;
        const editCTs = _l1Data.editCTs;
        const provideCTs = _l1Data.provideCTs;
        const isMainnet =
          isConnectedToMainNetwork || isConnectedToMainNetwork === undefined;

        const inNetwork = isMainnet
          ? SupportedChainId.TITAN
          : SupportedChainId.TITAN_SEPOLIA;
        const outNetwork = isMainnet
          ? SupportedChainId.MAINNET
          : SupportedChainId.SEPOLIA;

        //TON, ETH, USDC, USDT, TOS
        const priceList = await getCTTokenPrice();

        const result: CrossTradeData[] = datas.map((item) => {
          const isETH = isZeroAddress(item._l2token);

          //  will be refactor with split functions
          const tokenInfo = getSupportedTokenForCT(
            isETH
              ? "0x4200000000000000000000000000000000000006"
              : item._l2token,
            isMainnet
          );

          const isCanceled = isRequestCanceled({
            cancelCTs,
            saleCount: item._saleCount,
          });
          const isUpdated = isRequestEdited({
            editCTs,
            saleCount: item._saleCount,
          });
          const editCT = getEditCTTransaction({
            editCTs,
            saleCount: item._saleCount,
          })[0];

          const hasMarketPrice =
            tokenInfo?.tokenSymbol &&
            (tokenInfo.tokenSymbol as string) in priceList;
          const marketPrice = hasMarketPrice
            ? priceList[tokenInfo.tokenSymbol as keyof typeof priceList]
            : undefined;

          const ctAmount = isUpdated
            ? BigInt(editCT._ctAmount)
            : BigInt(item._ctAmount);

          const txnCost = provideCTTxnCost
            ? Number(commafy(provideCTTxnCost))
            : 0;
          const txnCostInAmount = marketPrice
            ? new Decimal(txnCost).div(marketPrice)
            : new Decimal(0);
          const txnCostAmount = txnCostInAmount.toFixed(tokenInfo?.decimals);

          const serviceFee = BigInt(item._totalAmount) - ctAmount;

          const formmatedProfitAmount = formatUnits(
            serviceFee.toString(),
            tokenInfo?.decimals
          );

          const profitAmount =
            Number(formmatedProfitAmount) - Number(txnCostAmount);
          const provideAmount = formatUnits(
            ctAmount.toString(),
            tokenInfo?.decimals
          );

          const profitRatio = (profitAmount / Number(provideAmount)) * 100;
          const profitUSD = profitAmount * (marketPrice ?? 0);
          const isProvided = isRequestProvided({
            providerClaimCTs,
            saleCount: item._saleCount,
          });
          const isProvidedOnL1 = isRequestProvidedOnL1({
            provideCTs,
            saleCount: item._saleCount,
          });
          const isInRelay = isProvidedOnL1 && !isProvided;

          const inToken = isETH
            ? {
              address: item._l1token,
              name: "ETH",
              symbol: "ETH",
              amount: ctAmount.toString(),
              decimals: 18,
            }
            : {
              address: item._l1token,
              name: tokenInfo?.tokenName as string,
              symbol: tokenInfo?.tokenSymbol as string,
              amount: ctAmount.toString(),
              decimals: tokenInfo?.decimals as number,
            };

          const outToken = isETH
            ? {
              address: item._l2token,
              name: "ETH",
              symbol: "ETH",
              amount: item._totalAmount,
              decimals: 18,
            }
            : {
              address: item._l2token,
              name: tokenInfo?.tokenName as string,
              symbol: tokenInfo?.tokenSymbol as string,
              amount: item._totalAmount,
              decimals: tokenInfo?.decimals as number,
            };

          const inTokenAmount = formatUnits(inToken.amount, inToken.decimals);
          const outTokenAmount = formatUnits(
            outToken.amount,
            outToken.decimals
          );
          const providingUSD = Number(inTokenAmount) * Number(marketPrice);
          const recevingUSD = Number(outTokenAmount) * Number(marketPrice);
          const percent = (profitUSD / providingUSD) * 100;

          return {
            requester: item._requester,
            inNetwork,
            outNetwork,
            inToken,
            outToken,
            profit: {
              amount: profitAmount.toString(),
              symbol: isETH ? "ETH" : (tokenInfo?.tokenSymbol as string),
              usd: profitUSD,
              percent: percent.toFixed(30),
              decimals: tokenInfo?.decimals as number,
            },
            blockTimestamps: Number(item.blockTimestamp),
            isActive: true,
            providingUSD,
            recevingUSD,
            subgraphData: item,
            isProvided,
            serviceFee: BigInt(serviceFee),
            isCanceled,
            isInRelay,
            isUpdateFee: isUpdated,
            initialCTAmount: item._ctAmount,
            editedCTAmount: ctAmount,
            isNetaveProfit: profitRatio.toFixed(30).includes("-"),
          };
        });

        const trimedResult = result.filter(
          (item) => !item.isCanceled && !item.isProvided
        );

        setIsLoading(false);
        return setRequestList(trimedResult);
      }
      setIsLoading(false);
      return null;
    } catch (e) {
      console.log(e);
    } finally {
      // setIsLoading(false);
    }
  }, [
    data,
    loading,
    error,
    isConnectedToMainNetwork,
    _l1Data,
    _l1Error,
    _l1Loading,
    provideCTTxnCost,
  ]);

  const l2RelayQueue = useMemo(() => {
    if (requestList)
      return requestList
        .filter((item) => item.isInRelay)
        .map((item) => item.subgraphData._saleCount);
  }, [requestList]);

  const requestDataBySaleCount = useMemo(() => {
    if (requestList && saleCount) {
      return requestList.find(
        (item) => item.subgraphData._saleCount === saleCount
      );
    }
  }, [requestList, saleCount]);

  useEffect(() => {
    fetchRequestList();
  }, [fetchRequestList]);

  useEffect(() => {
    if (error) {
      errorHandler(error);
    }
  }, [error]);

  return { requestList, isLoading, l2RelayQueue, requestDataBySaleCount };
};
