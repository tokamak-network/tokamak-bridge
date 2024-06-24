import { TokenInfo } from "@/types/token/supportedToken";
import { ethers } from "ethers";

export function convertNumber(
  amount: bigint | string,
  decimals: TokenInfo["decimals"]
) {
  const parsedAmount = ethers.utils.formatUnits(String(amount), decimals);
  return parsedAmount;
}
