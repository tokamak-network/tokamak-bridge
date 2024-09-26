import { useEffect, useState } from "react";

export function useTimeOver(props: {
  timeStamp: number;
  timeBuffer: number;
  needToCheck: boolean;
}) {
  const { timeStamp, timeBuffer, needToCheck } = props;
  const [isTimeOver, setIsTimeOver] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        needToCheck &&
        timeStamp + timeBuffer < Math.floor(Date.now() / 1000)
      ) {
        setIsTimeOver(true);
      } else {
        setIsTimeOver(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [needToCheck, timeStamp]);

  return { isTimeOver };
}
