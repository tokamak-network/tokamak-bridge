export const findTokenAmount = (
  l1Token: string,
  l2Token: string,
  claimer: string
): string => {
  const tokenData = require("./../../../constants/legacy-titan-assets/sepolia.json");

  const l1TokenLower = l1Token.toLowerCase();
  const l2TokenLower = l2Token.toLowerCase();
  const claimerLower = claimer.toLowerCase();
  const tokenEntry = tokenData.find(
    (entry: any) =>
      entry.l1Token.toLowerCase() === l1TokenLower &&
      entry.l2Token.toLowerCase() === l2TokenLower
  );

  if (!tokenEntry) {
    return "0";
  }

  const claimerData = tokenEntry.data.find(
    (data: any) => data.claimer.toLowerCase() === claimerLower
  );

  return claimerData ? claimerData.amount : "0";
};
