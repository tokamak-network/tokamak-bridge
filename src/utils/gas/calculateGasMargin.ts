import { BigNumber } from "@ethersproject/bignumber";

/**
 * Returns the gas value plus a margin for unexpected or variable gas costs
 * @param value the gas value to pad
 * @returns the gas value plus a margin
 * sometimes return gas could be up to 20% but actually needs 25%(80% -> 100%)
 */
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(125).div(100);
}
