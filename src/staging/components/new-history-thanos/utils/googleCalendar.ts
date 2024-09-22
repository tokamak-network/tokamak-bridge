import { useMemo } from "react";
import { format, addHours, addDays } from "date-fns";
import { atcb_action } from "add-to-calendar-button";
import {
  StandardHistory,
  Status,
  WithdrawTransactionHistory,
} from "@/staging/types/transaction";
import {
  FINALIZE_DESCRIPTION,
  FINALIZE_EVENT_NAME,
  PROVE_DESCRIPTION,
  PROVE_EVENT_NAME,
} from "@/staging/constants/calendar";
import { utcToZonedTime } from "date-fns-tz";

interface CalendarEventDetails {
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  description: string;
  options?: ("Google" | "Apple" | "iCal" | "Microsoft365")[];
}

export const getCalendarDetailsFromTx = (
  tx: StandardHistory,
  label: Status
) => {
  const name = label === Status.Prove ? PROVE_EVENT_NAME : FINALIZE_EVENT_NAME;
  const des = label === Status.Prove ? PROVE_DESCRIPTION : FINALIZE_DESCRIPTION;
  const period = label === Status.Prove ? 1 : 7 * 24;
  const blockTimestamp =
    label === Status.Prove
      ? tx.blockTimestamps.initialCompletedTimestamp
      : (tx as WithdrawTransactionHistory).blockTimestamps
          .proveCompletedTimestamp;
  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const originalTime = new Date(Number(blockTimestamp ?? 0) * 1000);
  const startDateTime = utcToZonedTime(originalTime, currentTimeZone);

  return getCalendarConfig(addHours(startDateTime, period), 0.25, name, des);
};

export const getCalendarConfig = (
  startDateTime: Date,
  hours: number,
  name: string,
  description: string
) => {
  // const startDateTime: Date = new Date(blockTimestamp * 1000); // Convert seconds to milliseconds

  const startDate: string = format(startDateTime, "yyyy-MM-dd"); // YYYY-MM-DD
  const startTime: string = format(startDateTime, "HH:mm"); // HH:mm

  const endDateTime: Date = addHours(startDateTime, hours); // Add duration
  const endDate: string = format(endDateTime, "yyyy-MM-dd"); // YYYY-MM-DD
  const endTime: string = format(endDateTime, "HH:mm"); // HH:mm

  const currentTimezone: string =
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const eventDetails: CalendarEventDetails = {
    name: name,
    startDate: startDate,
    endDate: endDate,
    startTime: startTime,
    endTime: endTime,
    timeZone: "currentBrowser",
    options: ["Google" as const],
    description: description,
  };

  return eventDetails;
};

export const bookGoogleEvent = (config: CalendarEventDetails) => {
  atcb_action(config);
};
