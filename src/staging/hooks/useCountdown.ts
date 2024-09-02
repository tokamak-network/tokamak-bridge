import { useState, useEffect } from "react";

export function useCountdown(initialTime: string, errorType?: boolean) {
  const [time, setTime] = useState(initialTime);
  const [format, setFormat] = useState(
    initialTime.split(":").length === 3 ? "HH : MM : SS" : "MM : SS"
  );

  useEffect(() => {
    if (!errorType && (time === "00 : 01" || time === "00 : 00 : 01")) return;

    const countdown = setInterval(() => {
      const timeParts = time.split(" : ").map(Number);

      if (timeParts.length === 3) {
        // HH : MM : SS 형식일 경우
        const [hours, minutes, seconds] = timeParts;
        let totalSeconds = hours * 3600 + minutes * 60 + seconds;

        if (!errorType) {
          totalSeconds -= 1;
        } else {
          totalSeconds += 1;
        }

        const newHours = Math.floor(totalSeconds / 3600);
        const newMinutes = Math.floor((totalSeconds % 3600) / 60);
        const newSeconds = totalSeconds % 60;

        if (newHours === 0) {
          setFormat("MM : SS");
          setTime(
            `${String(newMinutes).padStart(2, "0")} : ${String(
              newSeconds
            ).padStart(2, "0")}`
          );
        } else {
          const formattedHours = String(newHours).padStart(2, "0");
          const formattedMinutes = String(newMinutes).padStart(2, "0");
          const formattedSeconds = String(newSeconds).padStart(2, "0");

          setTime(
            `${formattedHours} : ${formattedMinutes} : ${formattedSeconds}`
          );
        }

        if (!errorType && totalSeconds <= 0) {
          clearInterval(countdown);
        }
      } else {
        // MM : SS 형식일 경우
        const [minutes, seconds] = timeParts;
        let totalSeconds = minutes * 60 + seconds;

        if (!errorType) {
          totalSeconds -= 1;
        } else {
          totalSeconds += 1;
        }

        const newMinutes = Math.floor(totalSeconds / 60);
        const newSeconds = totalSeconds % 60;

        if (newMinutes >= 60) {
          const newHours = Math.floor(newMinutes / 60);
          const remainingMinutes = newMinutes % 60;

          setFormat("HH : MM : SS");
          setTime(
            `${String(newHours).padStart(2, "0")} : ${String(
              remainingMinutes
            ).padStart(2, "0")} : ${String(newSeconds).padStart(2, "0")}`
          );
        } else {
          setTime(
            `${String(newMinutes).padStart(2, "0")} : ${String(
              newSeconds
            ).padStart(2, "0")}`
          );
        }

        if (!errorType && totalSeconds <= 0) {
          clearInterval(countdown);
        }
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [time, errorType]);

  return time;
}
