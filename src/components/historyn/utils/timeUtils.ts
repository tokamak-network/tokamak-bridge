import { format, fromUnixTime } from "date-fns";

/**
 * Converts time to minutes based on the specified unit and adds additional minutes if specified.
 *
 * @author Robert
 * @param time Number of time units to convert to minutes.
 * @param unit The unit of the time value ('days' or 'minutes').
 * @param additionalMinutes Additional minutes to add to the total. Default is 10.
 * @returns The total number of minutes.
 */
export const convertTimeToMinutes = (
  time: number,
  unit: "days" | "minutes",
  additionalMinutes: number = 10
): number => {
  const minutesInADay = 1440;
  let totalMinutes = time;

  if (unit === "days") {
    totalMinutes = time * minutesInADay;
  }

  return totalMinutes + additionalMinutes;
};

/**
 * Converts a Unix timestamp to a 'yyyy.MM.dd' formatted date string.
 *
 * @author Robert
 * @param timestamp The Unix timestamp to convert.
 * @returns A string representing the formatted date in 'yyyy.MM.dd' format.
 */
export const formatDateToYMD = (timestamp: number): string => {
  const date = fromUnixTime(timestamp);
  return format(date, "yyyy.MM.dd");
};
