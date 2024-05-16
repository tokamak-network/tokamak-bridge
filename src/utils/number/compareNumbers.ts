import { trimAmount } from "../trim";
import commafy from "../trim/commafy";

export function isBiggerThanMinimumNum(param: number, minimumValue?: number) {
  const minimumNum = minimumValue ?? 0.0001;
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

export function gasUsdFormatter(price: number | undefined) {
  return price !== undefined
    ? price < 0.01
      ? `$ <0.01`
      : `$${commafy(price, 2)}`
    : undefined;
}

export function smallNumberFormmater(
  param: number | string | undefined | null,
  deciplaPoints?: number,
  trimed?: boolean,
  removeComma?: boolean,
  minimumValue?: number,
  trimedDecimals?: number,
  showUnderMinimumValue?: number | string
) {
  if (param === undefined || param === null) {
    return "-";
  }
  if (Number(param) === 0) {
    return "0";
  }

  const isBiggerThanMinimum = isBiggerThanMinimumNum(
    typeof param === "string"
      ? Number(param.replaceAll(",", ""))
      : Number(param),
    minimumValue
  );

  return isBiggerThanMinimum
    ? trimed
      ? trimAmount(param.toString(), trimedDecimals ?? 8)
      : commafy(param, deciplaPoints ?? 6, removeComma, "0.00")
    : showUnderMinimumValue ?? "0.000000...";
}
