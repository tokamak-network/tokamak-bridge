import { Price, Token } from "@uniswap/sdk-core";
import JSBI from "jsbi";
import { Q192 } from "./internalConstants";
import { encodeSqrtRatioX96 } from "./encodeSqrtRatioX96";
import { TickMath } from "./tickMath";

/**
 * Returns a price object corresponding to the input tick and the base/quote token
 * Inputs must be tokens because the address order is used to interpret the price represented by the tick
 * @param baseToken the base token of the price
 * @param quoteToken the quote token of the price
 * @param tick the tick for which to return the price
 */
export function tickToPrice(
  baseToken: Token,
  quoteToken: Token,
  tick: number
): Price<Token, Token> {
  const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick);

  const ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96);

  return baseToken.sortsBefore(quoteToken)
    ? new Price(baseToken, quoteToken, Q192, ratioX192)
    : new Price(baseToken, quoteToken, ratioX192, Q192);
}
