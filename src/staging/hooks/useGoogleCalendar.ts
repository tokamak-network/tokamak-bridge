import { useMemo } from "react";
import { format, addHours } from "date-fns";
import { atcb_action } from "add-to-calendar-button";

export const useCalendar = (startDate: Date | null) => {
  const config = useMemo(() => {
    if (!startDate) return null;

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
  }, [startDate]);

  const handleCalendarClick = () => {
    if (config) {
      atcb_action(config);
    }
  };

  return { handleCalendarClick };
};
