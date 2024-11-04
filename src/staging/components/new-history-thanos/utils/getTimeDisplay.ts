import {
  TransactionHistory,
  isWithdrawTransactionHistory,
  isDepositTransactionHistory,
  isInCT_REQUEST_CANCEL,
  CT_Request_History,
  isInCT_Provide,
  CT_Provide_History,
  Action,
  Status,
} from "@/staging/types/transaction";
import {
  getTransactionConstants,
  TRANSACTION_CONSTANTS,
} from "@/staging/constants/transactionTime";
import { convertTimeToMinutes } from "@/staging/components/new-history-thanos/utils/timeUtils";
import {
  TransactionStatus,
  getStatusValue,
} from "@/staging/components/new-history-thanos/utils/historyStatus";
import { utcToZonedTime } from "date-fns-tz";
import { isThanosChain } from "@/utils/network/checkNetwork";
import { getBridgeL2ChainId } from "../../new-confirm/utils";
import { SupportedChainId } from "@/types/network/supportedNetwork";

// status 별로 변수 넣는 함수
export function getRemainTime(transactionData?: TransactionHistory): number {
  // 상태 별 number
  if (!transactionData) return 0;
  const action = transactionData.action;
  const status = transactionData.status;
  const l2ChainId = getBridgeL2ChainId(transactionData);
  const expectedTimes = getTransactionConstants(l2ChainId ?? SupportedChainId.TITAN);
  if (action === Action.Deposit) {
    const timeValue = calculateDepositPendingTime(
      transactionData.blockTimestamps.initialCompletedTimestamp,
      expectedTimes.DEPOSIT.INITIAL_SECS
    );
    return timeValue;
  } else if (action === Action.Withdraw) {
    const expectedTime = transactionData.blockTimestamps.proveCompletedTimestamp || transactionData.blockTimestamps.rollupCompletedTimestamp
      ? expectedTimes.WITHDRAW.CHALLENGE_SECS :
      transactionData.blockTimestamps.initialCompletedTimestamp ? expectedTimes.WITHDRAW.ROLLUP_SECS
        : expectedTimes.WITHDRAW.INITIAL_SECS;
    const originTimestamp = transactionData.blockTimestamps
      .proveCompletedTimestamp
      ? transactionData.blockTimestamps.proveCompletedTimestamp :
      transactionData.blockTimestamps.rollupCompletedTimestamp ? transactionData.blockTimestamps.rollupCompletedTimestamp
        : transactionData.blockTimestamps.initialCompletedTimestamp;
    return calculateDepositPendingTime(originTimestamp, expectedTime);
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

export const calculateDepositPendingTime = (
  blockTimestamp: number,
  expectedTime: number
) => {
  const countdownDuration = expectedTime;
  const currentTimeUTC = new Date();
  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTime = utcToZonedTime(currentTimeUTC, currentTimeZone);
  // Convert the current time from milliseconds to seconds
  const currentTimeInSeconds = Math.floor(currentTime.getTime() / 1000);

  // Convert blockTimestamp to the user's current timezone
  const zoneTime = utcToZonedTime(
    new Date(blockTimestamp * 1000),
    currentTimeZone
  );
  const adjustedBlockTimestamp = Math.floor(zoneTime.getTime() / 1000);

  // Calculate the remaining time
  const remainingTime =
    countdownDuration - (currentTimeInSeconds - adjustedBlockTimestamp);
  return remainingTime;
};
