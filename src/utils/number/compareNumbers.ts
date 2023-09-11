export function isBiggerThanMinimumNum(param: number) {
  const minimumNum = 0.0001;
  if (param > minimumNum) {
    return true;
  }
  return false;
}

export function smallNumberFormmater(param: number | string) {
  if (Number(param) === 0) {
    return "0";
  }

  const isBiggerThanMinimum = isBiggerThanMinimumNum(
    typeof param === "string" ? Number(param.replaceAll(",", "")) : param
  );

  return isBiggerThanMinimum ? String(param) : "<0.001";
}
