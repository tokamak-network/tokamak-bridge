import {
  TransactionHistory,
  isWithdrawTransactionHistory,
  TransactionStatus,
} from "@/components/historyn/types";
import { TRANSACTION_CONSTANTS } from "@/components/historyn/constants";
import { convertTimeToMinutes } from "@/components/historyn/utils/timeUtils";
import getStatusValue from "@/componenets/historyn/utils/historyStatus";

// status 별로 변수 넣는 함수
export function getTimeDisplay(transactionData: TransactionHistory) {
  // 상태 별 number
  const statusValue = getStatusValue(
    transactionData.action,
    transactionData.status
  );

  // 상수를 통해 정해진 시간을 추가해준다.
  switch (statusValue) {
    case TransactionStatus.WithdrawRollup: {
      const timeValue = calculateInitialTime(
        statusValue,
        transactionData.blockTimestamps.initialCompletedTimestamp,
        TRANSACTION_CONSTANTS.WITHDRAW.INITIAL_MINUTES,
        Boolean(transactionData.errorMessage)
      );
      return timeValue;
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
      const timeValue = calculateInitialTime(
        statusValue,
        transactionData.blockTimestamps.initialCompletedTimestamp,
        TRANSACTION_CONSTANTS.DEPOSIT.INITIAL_MINUTES
      );
      return timeValue;
    }
    default:
      return "-";
  }
}

// 타임 함수
export function calculateInitialTime(
  statusValue: number,
  blockTimestamp: string,
  additional: number,
  errorType?: boolean
) {
  const initialTimestamp = Number(blockTimestamp);
  const countdownDuration =
    statusValue === TransactionStatus.WithdrawFinalized
      ? convertTimeToMinutes(additional, "days", 0) * 60
      : convertTimeToMinutes(additional, "minutes", 0) * 60;

  const currentTime = Math.floor(Date.now() / 1000);
  const remainingTime = countdownDuration - (currentTime - initialTimestamp);
  const totalTime = errorType ? Math.abs(remainingTime) : remainingTime;

  if (totalTime <= 0) {
    return "00:00";
  }

  const hours = Math.floor(totalTime / 3600);
  const minutes = Math.floor((totalTime % 3600) / 60);
  const seconds = totalTime % 60;

  if (hours > 0) {
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
