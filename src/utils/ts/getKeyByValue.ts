export function getKeyByValue<T extends Record<keyof T, string | number>>(
  enumObj: T,
  value: T[keyof T]
): keyof T | undefined {
  const keys = Object.keys(enumObj) as (keyof T)[];
  //   const matchedKey = keys.find((key) => enumObj[key] === value);
  //   const unmatchedKey = keys.find((key) => enumObj[key] !== value);

  return keys.find((key) => enumObj[key] === value);
}
