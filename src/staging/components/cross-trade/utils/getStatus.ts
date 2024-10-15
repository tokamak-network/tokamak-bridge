import { TRANSACTION_CONSTANTS } from "@/staging/constants/transactionTime";
import { CrossTradeData } from "@/staging/types/crossTrade";
import {
  CT_PROVIDE,
  CT_REQUEST,
  CT_REQUEST_CANCEL,
  HISTORY_TRANSACTION_STATUS,
  Status,
} from "@/staging/types/transaction";
import { utcToZonedTime } from "date-fns-tz";

export const STATUS = {
  DISABLED: 0,
  COUNTDOWN: 1,
  ACTIVE: 2,
};

export const getStatus = (item: CrossTradeData): number => {
  const currentTimeUTC = new Date();
  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTime = utcToZonedTime(currentTimeUTC, currentTimeZone).getTime();
  const activationTime =
    item.blockTimestamps * 1000 +
    TRANSACTION_CONSTANTS.CROSS_TRADE.PROVIDE * 1000; // Convert to milliseconds

  if (!item.isActive) {
    if (currentTime < activationTime) {
      return STATUS.COUNTDOWN;
    }
    return STATUS.DISABLED;
  }

  return STATUS.ACTIVE;
};

export function calculateInitialCountdown(
  blockTimestamps: number,
  countdownDuration: number,
): number {
  const currentTimeUTC = new Date();
  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTime = utcToZonedTime(currentTimeUTC, currentTimeZone);

  const currentTimeInSeconds = Math.floor(currentTime.getTime() / 1000);

  const zoneTime = utcToZonedTime(
    new Date(blockTimestamps * 1000),
    currentTimeZone,
  );
  const adjustedBlockTimestamp = Math.floor(zoneTime.getTime() / 1000);

  const remainingTime =
    countdownDuration - (currentTimeInSeconds - adjustedBlockTimestamp);

  return remainingTime;
}

export const isFinalStatus = (status: HISTORY_TRANSACTION_STATUS) => {
  return (
    status === Status.Completed ||
    status === CT_REQUEST.Completed ||
    status === CT_REQUEST_CANCEL.Completed ||
    status === CT_PROVIDE.Completed
  );
};
