import {
  TransactionHistory,
  isWithdrawTransactionHistory,
  isDepositTransactionHistory,
  isInCT_REQUEST_CANCEL,
  CT_Request_History,
  isInCT_Provide,
  CT_Provide_History,
} from "@/staging/types/transaction";
import { TRANSACTION_CONSTANTS } from "@/staging/constants/transactionTime";
import { convertTimeToMinutes } from "@/staging/components/new-history/utils/timeUtils";
import {
  TransactionStatus,
  getStatusValue,
} from "@/staging/components/new-history/utils/historyStatus";
import { utcToZonedTime } from "date-fns-tz";

// status 별로 변수 넣는 함수
export function getRemainTime(transactionData: TransactionHistory): number {
  // 상태 별 number
  const statusValue = getStatusValue(
    transactionData.action,
    transactionData.status
  );

  // 상수를 통해 정해진 시간을 추가해준다.
  switch (statusValue) {
    case TransactionStatus.WithdrawRollup: {
      if (
        isWithdrawTransactionHistory(transactionData) &&
        transactionData.blockTimestamps.initialCompletedTimestamp
      ) {
        const timeValue = calculateInitialTime(
          statusValue,
          transactionData.blockTimestamps.initialCompletedTimestamp,
          TRANSACTION_CONSTANTS.WITHDRAW.ROLLUP_MINUTES,
          Boolean(transactionData.errorMessage)
        );
        return timeValue;
      }
    }
    case TransactionStatus.WithdrawFinalized: {
      if (
        isWithdrawTransactionHistory(transactionData) &&
        transactionData.blockTimestamps.rollupCompletedTimestamp
      ) {
        const timeValue = calculateInitialTime(
          statusValue,
          transactionData.blockTimestamps.rollupCompletedTimestamp,
          TRANSACTION_CONSTANTS.WITHDRAW.ROLLUP_DAYS
        );
        return timeValue;
      }
    }
    case TransactionStatus.DepositFinalized: {
      if (
        isDepositTransactionHistory(transactionData) &&
        transactionData.blockTimestamps.initialCompletedTimestamp
      ) {
        const timeValue = calculateInitialTime(
          statusValue,
          transactionData.blockTimestamps.initialCompletedTimestamp,
          TRANSACTION_CONSTANTS.DEPOSIT.INITIAL_SECS
        );

        return timeValue;
      }
    }
    case TransactionStatus.REQUEST_CANCEL: {
      const CT_Request_TransactionData = transactionData as CT_Request_History;
      if (
        isInCT_REQUEST_CANCEL(CT_Request_TransactionData.status) &&
        CT_Request_TransactionData.blockTimestamps.cancelRequest
      ) {
        const timeValue = calculateInitialTime(
          statusValue,
          CT_Request_TransactionData.blockTimestamps.cancelRequest,
          TRANSACTION_CONSTANTS.CROSS_TRADE.CANCEL_REQUEST,
          Boolean(transactionData.errorMessage)
        );
        return timeValue;
      }
    }
    case TransactionStatus.RETURN_NOT_COMPLETED: {
      const CT_Request_TransactionData = transactionData as CT_Provide_History;
      if (
        isInCT_Provide(CT_Request_TransactionData.status) &&
        CT_Request_TransactionData.blockTimestamps.provide
      ) {
        const timeValue = calculateInitialTime(
          statusValue,
          CT_Request_TransactionData.blockTimestamps.provide,
          TRANSACTION_CONSTANTS.CROSS_TRADE.RETURN_LIQUIDITY,
          Boolean(transactionData.errorMessage)
        );
        return timeValue;
      }
    }
  }
  return 0;
}

// Function to calculate the initial time
function calculateInitialTime(
  statusValue: number,
  blockTimestamp: number,
  additional: number,
  errorType?: boolean
): number {
  const initialTimestamp = Number(blockTimestamp);
  const countdownDuration =
    statusValue === TransactionStatus.WithdrawFinalized
      ? convertTimeToMinutes(additional, "days", 0) * 60
      : TransactionStatus.REQUEST_CANCEL
      ? additional
      : convertTimeToMinutes(additional, "minutes", 0) * 60;

  console.log("countdownDuration", countdownDuration);

  // Get the current time in the user's local timezone
  const currentTimeUTC = new Date();
  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTime = utcToZonedTime(currentTimeUTC, currentTimeZone);

  // Convert the current time from milliseconds to seconds
  const currentTimeInSeconds = Math.floor(currentTime.getTime() / 1000);

  // Convert blockTimestamp to the user's current timezone
  const zoneTime = utcToZonedTime(
    new Date(initialTimestamp * 1000),
    currentTimeZone
  );
  const adjustedBlockTimestamp = Math.floor(zoneTime.getTime() / 1000);

  // Calculate the remaining time
  const remainingTime =
    countdownDuration - (currentTimeInSeconds - adjustedBlockTimestamp);

  const totalTime = errorType ? Math.abs(remainingTime) : remainingTime;

  return totalTime;
}
