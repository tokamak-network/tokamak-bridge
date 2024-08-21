import { TokenInfo } from "@/types/token/supportedToken";

export function isTON(token: TokenInfo | null) {
  if (token === null) return false;
  return token.tokenSymbol === "TON";
}
