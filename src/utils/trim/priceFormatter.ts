import commafy from "./commafy";

export function priceFormmater(
  price: string | number | undefined
): string | "NA" {
  let priceValue = undefined;

  if (typeof price === "string" && price.includes(",")) {
    priceValue = price.replaceAll(",", "");
  } else {
    priceValue = Number(price);
  }

  if (priceValue === 0 || isNaN(Number(priceValue))) return "0";

  const result = commafy(priceValue, 2);

  return result;
}
