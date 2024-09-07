import { useState, useEffect } from "react";
import { formatTimeDisplay } from "../utils/formatTimeDisplay";

export function useCountdown(initialTime: number, errorType?: boolean) {
  const [isCountDown, setIsCountDown] = useState(initialTime > 0);
  const [time, setTime] = useState<number>(Math.abs(initialTime));

  useEffect(() => {
    const countdown = setInterval(() => {
      if (isCountDown) {
        setTime((prev) => {
          if (prev <= 0) {
            setIsCountDown(false);
            return 0; // Stop at 0
          }
          return prev - 1;
        });
      } else {
        setTime((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [isCountDown]);

  return { time: formatTimeDisplay(time), isCountDown };
}
