import { CT_ACTION, CT_Provide_History, HISTORY_SORT } from "@/staging/types/transaction";
import { useEffect, useState } from "react";
import { useCrossTradeData_L1, useCrossTradeData_L2 } from "../useCrossTrade";
import useConnectedNetwork from "@/hooks/network";
import { getProvideErrorMessage, getTokenInfo } from "@/staging/utils/getRequestStatus";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getL2TransactionsBySaleCount, getProvideBlockTimestamp, getProvideStatus, getProvideTransactionHash } from "@/staging/utils/getProvideStatus";
export const useProvideData = () => {
  const [provideHistory, setProvideHistory] = useState<
    CT_Provide_History[] | [] | null
  >(null);
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { data: l1Data } = useCrossTradeData_L1({
    isHistory: true,
  });
  const { data: l2Data } = useCrossTradeData_L2({
    isHistory: true,
  });

  useEffect(() => {
    if (l1Data && l2Data) {
      const requestCTs = l2Data.requestCTs;
      const providerClaimCTs = l2Data.providerClaimCTs;
      const provideCTs = l1Data.provideCTs;

      const trimedData: CT_Provide_History[] = provideCTs.map((provideCT) => {
        const {
          _l1token,
          _l2token,
          _provider,
          _totalAmount,
          _ctAmount,
          _saleCount,
          _l2chainId,
          blockTimestamp,
        } = provideCT;
        const saleCount = _saleCount;

        const status = getProvideStatus({
          providerClaimCTs,
          provideCT,
        });
        const providerClaimCTTransaction = getL2TransactionsBySaleCount({
          transactions: providerClaimCTs,
          saleCount,
        });
        const blockTimestamps = getProvideBlockTimestamp({
          status,
          provideCT,
          providerClaimCT: providerClaimCTTransaction,
        });
        const inToken = getTokenInfo({
          requestData: provideCT,
          ctAmount: true,
          isConnectedToMainNetwork,
        });
        const outToken = getTokenInfo({
          requestData: provideCT,
          isConnectedToMainNetwork,
        });
        const transactionHashes = getProvideTransactionHash({
          status,
          provideCT,
          providerClaimCT: providerClaimCTTransaction,
        });
        const serviceFee = BigInt(_totalAmount) - BigInt(_ctAmount);

        return {
          category: HISTORY_SORT.CROSS_TRADE,
          action: CT_ACTION.PROVIDE,
          status,
          blockTimestamps,
          inNetwork: isConnectedToMainNetwork
            ? SupportedChainId.MAINNET
            : SupportedChainId.SEPOLIA,
          outNetwork: Number(_l2chainId),
          inToken,
          outToken,
          transactionHashes,
          serviceFee,
          errorMessage: getProvideErrorMessage(status, blockTimestamps),
          L1_subgraphData: provideCT,
        };
      });

      setProvideHistory(trimedData);
    }
  }, [l1Data, l2Data]);

  return { provideHistory };
};