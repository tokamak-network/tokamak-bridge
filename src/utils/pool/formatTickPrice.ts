import { Bound } from "@/types/pool/pool";
import { formatPrice, NumberType } from "@uniswap/conedison/format";
import { Price, Token } from "@uniswap/sdk-core";

interface FormatTickPriceArgs {
  price?: Price<Token, Token>;
  atLimit: { [bound in Bound]?: boolean | undefined };
  direction: Bound;
  placeholder?: string;
  numberType?: NumberType;
}

export function formatTickPrice({
  price,
  atLimit,
  direction,
  placeholder,
  numberType,
}: FormatTickPriceArgs) {
  if (atLimit[direction]) {
    return direction === Bound.LOWER ? "0" : "∞";
  }

  if (!price && placeholder !== undefined) {
    return placeholder;
  }

  return formatPrice(price, numberType ?? NumberType.TokenNonTx);
}
