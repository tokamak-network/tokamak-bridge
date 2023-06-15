export function isBiggerThanMinimumNum(param: number) {
    const minimumNum = 0.0001;
    if (param > minimumNum) {
      return true;
    }
    return false;
  }