import {
  TransactionHistory,
  isWithdrawTransactionHistory,
  isDepositTransactionHistory,
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
          TRANSACTION_CONSTANTS.WITHDRAW.INITIAL_MINUTES,
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
          TRANSACTION_CONSTANTS.DEPOSIT.INITIAL_MINUTES
        );
        return timeValue;
      }
    }
    default:
      return 0;
  }
}

// 타임 함수
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
      : convertTimeToMinutes(additional, "minutes", 0) * 60;

  // Current time in UTC
  const currentTimeUTC = new Date();
  // Convert to Asia/Seoul time -> timestamp in milliseconds
  const currentTimeKST = utcToZonedTime(currentTimeUTC, "Asia/Seoul");
  // Convert milliseconds to seconds (needed for countdown calculation in seconds)
  const currentTime = Math.floor(currentTimeKST.getTime() / 1000);

  const remainingTime = countdownDuration - (currentTime - initialTimestamp);
  const totalTime = errorType ? Math.abs(remainingTime) : remainingTime;

  return totalTime;
}

export function formatTimeDisplay(finalTime: number): string {
  if (finalTime <= 0) {
    return "00 : 00";
  }

  const hours = Math.floor(finalTime / 3600);
  const minutes = Math.floor((finalTime % 3600) / 60);
  const seconds = finalTime % 60;

  if (hours > 0) {
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedHours} : ${formattedMinutes} : ${formattedSeconds}`;
  } else {
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes} : ${formattedSeconds}`;
  }
}
