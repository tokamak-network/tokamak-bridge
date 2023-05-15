type SupportedMainTokens = "TON" | "TOS" | "WTON" | "ETH";
type SupportedEcosystemTokens = "DOC" | "AURA" | "LYDA";
type SupportedStableTokens = "USDC";

export type SupportedToken =
  | SupportedMainTokens
  | SupportedEcosystemTokens
  | SupportedStableTokens;
