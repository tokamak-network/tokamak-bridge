import commafy from "./commafy";

export function trimAddress(args: {
  address: string | `0x${string}` | undefined;
  firstChar?: number;
  lastChar?: number;
  dots?: string;
}): string {
  if (args?.address === undefined) {
    return "";
  }
  const { address, firstChar, lastChar, dots } = args;
  const firstChatAt = address.substring(0, firstChar ?? 4);
  const lastCharAt = address.substring(address.length - (lastChar ?? 4));
  return `${firstChatAt}${dots ?? "..."}${lastCharAt}`;
}

export function trimAmountForFormatter(
  amount: string | null | undefined,
  decimalPlaces?: number
) {
  if (amount === null || amount === undefined) {
    return "";
  }
  const biggerThanMaximum = Number(amount.replaceAll(",", "")) > 999999999;
  const lowerThanMinimum = Number(amount.replaceAll(",", "")) < 0.000001;
  const lowerThanInteger = Number(amount.replaceAll(",", "")) < 1;

  const decimals = decimalPlaces ?? lowerThanMinimum ? 6 : 9;

  if (amount.length < decimals) {
    return commafy(amount, 2);
  }
  if (!lowerThanInteger) {
    const result = commafy(amount, 9);
    const numberOfCommas = result.split(",").length - 1;
    return `${result.slice(0, decimals - 1 + numberOfCommas)}...`;
  }
  return `${amount.slice(0, decimals - 1)}...`;
}

export function trimAmount(
  amount: string | null | undefined,
  decimalPlaces?: number
) {
  if (amount === null || amount === undefined) {
    return "";
  }

  const decimals = decimalPlaces ?? 9;

  if (amount.length < decimals) {
    return amount;
  }
  return `${amount.slice(0, decimals - 1)}...`;
}
