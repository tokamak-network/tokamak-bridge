export function isBiggerThanMinimumNum(param: number) {
  const minimumNum = 0.0001;
  if (param > minimumNum) {
    return true;
  }
  return false;
}

export function smallNumberFormmater(param: number) {
  const isBiggerThanMinimum = isBiggerThanMinimumNum(param);

  return isBiggerThanMinimum ? String(param) : "<0.001";
}
