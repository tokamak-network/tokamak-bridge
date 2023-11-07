import { trimAmount } from "../trim";
import commafy from "../trim/commafy";

export function isBiggerThanMinimumNum(param: number, minimumValue?: number) {
  const minimumNum = minimumValue ?? 0.0001;
  if (param > minimumNum) {
    return true;
  }
  return false;
}

export function smallNumberFormmater(
  param: number | string | undefined | null,
  deciplaPoints?: number,
  trimed?: boolean,
  removeComma?: boolean,
  minimumValue?: number
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
      ? trimAmount(param.toString(), 8)
      : commafy(param, deciplaPoints ?? 6, removeComma, "0.00")
    : "<0.000001";
}
