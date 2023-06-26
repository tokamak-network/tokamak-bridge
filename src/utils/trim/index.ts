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

export function trimAmount(amount: string | null | undefined) {
  if (amount === null || amount === undefined) {
    return "-";
  }
  if (amount?.length < 9) {
    return amount;
  }
  return `${amount?.slice(0, 8)}...`;
}
