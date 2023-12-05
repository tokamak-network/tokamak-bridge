export function splitNumber(param: string) {
  const splitedParam = param.split(".");
  if (splitedParam.length > 1) {
    return splitedParam[0].length > 4 ? splitedParam[0] : param;
  }
  return param;
}
