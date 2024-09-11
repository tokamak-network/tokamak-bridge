import { useState, useEffect } from "react";
import { formatTimeDisplay } from "../utils/formatTimeDisplay";
import { TransactionHistory } from "../types/transaction";

export function useCountdown(
  initialTime: number,
  errorType?: boolean,
  tx?: TransactionHistory
) {
  const [isCountDown, setIsCountDown] = useState(
    Number.isNaN(initialTime) ? false : initialTime > 0
  );
  const [time, setTime] = useState<number>(Math.abs(initialTime));

  useEffect(() => {
    setTime(Math.abs(initialTime));
    setIsCountDown(initialTime > 0);
  }, [tx]);

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
