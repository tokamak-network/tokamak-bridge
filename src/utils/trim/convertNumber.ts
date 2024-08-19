import { TokenInfo } from "@/types/token/supportedToken";
import { ethers } from "ethers";

export function convertNumber(
  amount: bigint | string,
  decimals: TokenInfo["decimals"]
) {
  const parsedAmount = ethers.utils.formatUnits(String(amount), decimals);
  return parsedAmount;
}

export function toParseNumber(amount: bigint | string, decimals: number) {
  if (isNaN(Number(amount.toString()))) return undefined;
  return ethers.utils.parseUnits(String(amount), decimals);
}

export function formatUnits(amount?: string, decimals?: number) {
  if (amount === undefined || decimals === undefined) return "0";
  return ethers.utils.formatUnits(amount, decimals);
}
