import commafy from "../trim/commafy";

export function isBiggerThanMinimumNum(param: number) {
  const minimumNum = 0.0001;
  if (param > minimumNum) {
    return true;
  }
  return false;
}

export function smallNumberFormmater(
  param: number | string,
  deciplaPoints?: number
) {
  if (Number(param) === 0) {
    return "0";
  }

  const isBiggerThanMinimum = isBiggerThanMinimumNum(
    typeof param === "string"
      ? Number(param.replaceAll(",", ""))
      : Number(param)
  );

  return isBiggerThanMinimum ? commafy(param, deciplaPoints ?? 6) : "<0.001";
}
