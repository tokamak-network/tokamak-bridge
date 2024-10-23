import commafy from "@/utils/trim/commafy";

export function formatProfit(value: string | undefined) {
  if (!value) return;
  const [integerPart] = value.split(".");
  if (integerPart.replaceAll("-", "").length > 4) {
    return integerPart;
  }
  return commafy(value, undefined, true);
}
