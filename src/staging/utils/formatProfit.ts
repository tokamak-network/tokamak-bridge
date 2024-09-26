export function formatProfit(value: number | string | undefined) {
  if (value === undefined) return;
  if (Number(value) < 0.01 && Number(value) > 0) {
    return "< 0.01";
  }
  return `${Number(value).toFixed(2)}`;
}
