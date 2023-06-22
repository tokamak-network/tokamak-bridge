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

export function trimAmount(args: { amount: string }): string {
  if (args.amount === undefined) {
    return "";
  }

  const { amount } = args;
  let result = amount;
  if (amount.includes(".")) {
    const tempResult = parseFloat(amount).toFixed(2);
    const formattedTemp = commafy(tempResult);

    result = `${formattedTemp}...`;
  } else {
    result = commafy(result);
  }

  return result;
}
