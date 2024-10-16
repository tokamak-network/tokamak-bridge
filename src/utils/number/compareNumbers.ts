import { trimAmount, trimAmountForFormatter } from "../trim";
import commafy from "../trim/commafy";

export function isBiggerThanMinimumNum(param: number, minimumValue?: number) {
  const minimumNum = minimumValue ?? 0.000001;
  if (param > minimumNum) {
    return true;
  }
  return false;
}

export function getGasCostText(totalGasCost: string | null | undefined) {
  if (totalGasCost === undefined || totalGasCost === null) {
    return undefined;
  }
  return `${
    isBiggerThanMinimumNum(Number(totalGasCost))
      ? commafy(totalGasCost, 4)
      : "< 0.0001"
  } ETH`;
}

export function gasUsdFormatter(
  price: number | undefined,
  displayMinimumValue?: number | string,
) {
  return price !== undefined
    ? price === 0
      ? displayMinimumValue ?? `$0.00`
      : price < 0.01
      ? `< $0.01`
      : `$${commafy(price, 2)}`
    : undefined;
}

export function smallNumberFormmater(params: {
  amount: number | string | undefined | null;
  decimals?: number;
  trimed?: boolean;
  removeComma?: boolean;
  minimumValue?: number;
  trimedDecimals?: number;
  displayMinimumValue?: number | string;
}) {
  const {
    amount,
    decimals,
    trimed,
    removeComma,
    minimumValue,
    trimedDecimals,
    displayMinimumValue,
  } = params;
  if (amount === undefined || amount === null) {
    return "-";
  }
  if (Number(amount) === 0) {
    return "0";
  }

  const isBiggerThanMinimum = isBiggerThanMinimumNum(
    typeof amount === "string"
      ? Number(amount.replaceAll(",", ""))
      : Number(amount),
    minimumValue,
  );

  return isBiggerThanMinimum
    ? trimed
      ? trimAmountForFormatter(amount.toString())
      : commafy(amount, decimals ?? 6, removeComma, "0.00")
    : displayMinimumValue ?? "0.000000...";
}
