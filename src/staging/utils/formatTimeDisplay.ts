export function formatTimeDisplay(finalTime: number): string {
  const hours = Math.floor(finalTime / 3600);
  const minutes = Math.floor((finalTime % 3600) / 60);
  const seconds = finalTime % 60;

  if (hours > 0) {
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedHours} : ${formattedMinutes} : ${formattedSeconds}`;
  } else {
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes} : ${formattedSeconds}`;
  }
}
