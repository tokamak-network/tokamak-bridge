import { Currency, Price } from "@uniswap/sdk-core";

export function getRatio(
  lower: Price<Currency, Currency>,
  current: Price<Currency, Currency>,
  upper: Price<Currency, Currency>
) {
  try {
    if (!current.greaterThan(lower)) {
      return 100;
    } else if (!current.lessThan(upper)) {
      return 0;
    }

    const lowerN = Number.parseFloat(lower.toSignificant(15));
    const upperN = Number.parseFloat(upper.toSignificant(15));
    const currentN = Number.parseFloat(current.toSignificant(15));

    const ratio = Math.floor(
      (1 /
        ((Math.sqrt(lowerN * upperN) - Math.sqrt(upperN * currentN)) /
          (currentN - Math.sqrt(upperN * currentN)) +
          1)) *
        100
    );

    if (ratio < 0 || ratio > 100) {
      throw Error("Out of range");
    }

    return ratio;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
