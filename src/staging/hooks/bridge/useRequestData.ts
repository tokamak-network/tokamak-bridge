import { CT_ACTION, CT_Request_History, HISTORY_SORT, isInCT_REQUEST_CANCEL } from "@/staging/types/transaction";
import { useEffect, useState } from "react";
import { useCrossTradeData_L1, useCrossTradeData_L2 } from "../useCrossTrade";
import useConnectedNetwork from "@/hooks/network";
import { getEditCTTransaction, getRequestBlockTimestamp, getRequestErrorMessage, getRequestStatus, getRequestTransactionHash, getTokenInfo, isRequestEdited } from "@/staging/utils/getRequestStatus";
import { SupportedChainId } from "@/types/network/supportedNetwork";

export const useRequestHistoryData = () => {
  const [requestHistory, setRequestHistory] = useState<
    CT_Request_History[] | [] | null
  >(null);
  const { data: l2Data } = useCrossTradeData_L2({
    isHistory: true,
  });
  const { data: l1Data } = useCrossTradeData_L1({});
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  useEffect(() => {
    if (l2Data && l1Data) {
      const requestCTs = l2Data.requestCTs;
      const cancelCTs = l2Data.cancelCTs;
      const providerClaimCTs = l1Data.provideCTs;
      const editCTs = l1Data.editCTs;
      const l1CancelCTs = l1Data.l1CancelCTs;

      const trimedData = requestCTs.map((requestData) => {
        const {
          _l1token,
          _l2token,
          _requester,
          _totalAmount,
          _ctAmount,
          _saleCount,
          _hashValue,
          _l2chainId,
          blockTimestamp,
        } = requestData;

        const status = getRequestStatus({
          requestData,
          cancelCTs,
          l1CancelCTs,
          providerClaimCTs,
          editCTs,
        });

        const isUpdateFee = isRequestEdited({
          editCTs,
          saleCount: _saleCount,
        });
        const editCT = getEditCTTransaction({
          editCTs,
          saleCount: _saleCount,
        })[0];

        const blockTimestamps = getRequestBlockTimestamp({
          status,
          requestData,
          l1CancelCTs,
          cancelCTs,
          providerClaimCTs,
          editCTs,
        });
        const inToken = getTokenInfo({ requestData, isConnectedToMainNetwork });
        const outToken = getTokenInfo({
          requestData,
          ctAmount: true,
          _editedctAmount: isUpdateFee ? editCT._ctAmount : undefined,
          isConnectedToMainNetwork,
        });
        const transactionHashes = getRequestTransactionHash({
          status,
          requestData,
          l1CancelCTs,
          cancelCTs,
          providerClaimCTs,
          editCTs,
        });

        const ctAmount = isUpdateFee
          ? BigInt(editCT._ctAmount)
          : BigInt(_ctAmount);
        const serviceFee = BigInt(_totalAmount) - ctAmount;

        if (!blockTimestamps || !transactionHashes) return null;

        const hasMultipleUpdateFees = () => {
          if (!isUpdateFee) return false;
          if (blockTimestamps && blockTimestamps.updateFee)
            return blockTimestamps.updateFee.length > 1;
        };

        const result: CT_Request_History = {
          category: HISTORY_SORT.CROSS_TRADE,
          action: CT_ACTION.REQUEST,
          isCanceled: isInCT_REQUEST_CANCEL(status),
          status,
          blockTimestamps,
          inNetwork: Number(_l2chainId),
          outNetwork: isConnectedToMainNetwork
            ? SupportedChainId.MAINNET
            : SupportedChainId.SEPOLIA,
          inToken,
          outToken,
          transactionHashes,
          serviceFee,
          L2_subgraphData: requestData,
          isUpdateFee,
          hasMultipleUpdateFees: hasMultipleUpdateFees(),
          errorMessage: getRequestErrorMessage(status, blockTimestamps),
        };
        return result;
      });

      const result = trimedData.filter((data) => data !== null);
      // const result = [mock_cancelRequest];
      setRequestHistory(result as CT_Request_History[]);
    }
  }, [l1Data, l2Data, isConnectedToMainNetwork]);

  return { requestHistory };
};