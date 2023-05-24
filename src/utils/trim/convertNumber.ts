import { TokenInfo } from "@/types/token/supportedToken";
import { ethers } from "ethers";

export function convertNumber(amount: bigint, decimals: TokenInfo["decimals"]) {
  const parsedAmount = ethers.formatUnits(String(amount), decimals);
  return parsedAmount;
}
