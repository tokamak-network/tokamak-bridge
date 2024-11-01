import { useMemo } from "react";
import {
  CT_History,
  CT_Provide_History,
  CT_Request_History,
  StandardHistory,
  TransactionHistory,

} from "@/staging/types/transaction";
import { useDepositData } from "./useDepositData";
import { useWithdrawData } from "./useWithdrawData";
import { useRequestHistoryData } from "./useRequestData";
import { useProvideData } from "./useProvideData";

export const useBridgeHistory = () => {
  const { depositHistory } = useDepositData();
  const { withdrawHistory } = useWithdrawData();
  const { requestHistory } = useRequestHistoryData();
  const { provideHistory } = useProvideData();

  const bridgeHistoryData = useMemo(() => {
    if (depositHistory && withdrawHistory) {
      // Ensure both arrays are of a compatible type
      const combinedHistory: TransactionHistory[] = [
        ...(depositHistory as TransactionHistory[]),
        ...(withdrawHistory as TransactionHistory[]),
      ];

      return combinedHistory;
    }
  }, [depositHistory, withdrawHistory]);

  const CT_HistoryData = useMemo(() => {
    if (requestHistory && provideHistory) {
      // Ensure both arrays are of a compatible type
      const combinedHistory: CT_History[] = [
        ...(requestHistory as CT_Request_History[]),
        ...(provideHistory as CT_Provide_History[]),
      ];

      return combinedHistory;
    }
  }, [requestHistory, provideHistory]);

  return {
    depositHistory,
    withdrawHistory,
    bridgeHistoryData,
    requestHistory,
    provideHistory,
    CT_HistoryData,
  };
};

export const updatedHistory = (
  legacyHistory: StandardHistory[] | null,
  historyToUpdate: StandardHistory[]
) => {
  if (historyToUpdate.length === 0) return legacyHistory ?? [];
  const firstBlocktimeStampToUpdate =
    historyToUpdate[historyToUpdate.length - 1].blockTimestamps;

  return [
    ...historyToUpdate,
    ...(legacyHistory ?? []).filter(
      (tx) =>
        tx.blockTimestamps.initialCompletedTimestamp <
        firstBlocktimeStampToUpdate.initialCompletedTimestamp
    ),
  ];
};
