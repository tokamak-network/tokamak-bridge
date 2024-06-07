import { useMemo } from "react";
import { format, addHours } from "date-fns";
import { TRANSACTION_CONSTANTS } from "@/components/historyn/constants";
import { convertTimeToMinutes } from "@/components/historyn/utils/timeUtils";
import { TransactionHistory } from "@/components/historyn/types";
import { atcb_action } from "add-to-calendar-button";

interface CalendarConfig {
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  options: (
    | "Google"
    | "Apple"
    | "iCal"
    | "Microsoft365"
    | "MicrosoftTeams"
    | "Outlook.com"
    | "Yahoo"
  )[];
  timeZone: string;
}

export const useCalendarConfig = (
  calendarButton: boolean,
  timeStamp: string | undefined
): { config: CalendarConfig | null; onClick: () => void } => {
  const config = useMemo(() => {
    if (calendarButton) {
      const statusDuration = convertTimeToMinutes(
        TRANSACTION_CONSTANTS.WITHDRAW.ROLLUP_DAYS,
        "days",
        0
      );
      const startDate = new Date(
        (Number(timeStamp) + statusDuration * 60) * 1000
      );
      const formattedDate = format(startDate, "yyyy-MM-dd");
      const startTime = format(startDate, "HH:mm");
      const endTime = format(addHours(startDate, 1), "HH:mm");

      return {
        name: "Claim withdrawal on Ethereum network using Tokamak Bridge",
        description:
          "How to claim:\n1. Go to Tokamak Bridge (https://bridge.tokamak.network/) \n2. Connect to your wallet \n3. Click the wallet address on the top right \n4. Find the relevant claim transaction and click “Claim”",
        startDate: formattedDate,
        startTime: startTime,
        endTime: endTime,
        options: ["Google" as const],
        timeZone: "currentBrowser",
      };
    }
    return null;
  }, [calendarButton]);

  const onClick = () => {
    if (config) {
      atcb_action(config);
    }
  };

  return { config, onClick };
};
