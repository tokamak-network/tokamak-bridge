import { supportedTokens } from "@/types/token/supportedToken";

function checkIfTokenAddressExists(
  tokenAddress: string,
  address: Object
): string | null {
  for (const [network, contractAddress] of Object.entries(address)) {
    if (contractAddress === tokenAddress) {
      return network;
    }
  }
  return null;
}

export const getSupportedTokenInfo = (params: {
  tokenAddress: string;
  networkName: string;
}) => {
  const { tokenAddress, networkName } = params;
  const supportedOutToken = supportedTokens.filter((token) =>
    checkIfTokenAddressExists(tokenAddress, token.address)
  );
  if (supportedOutToken) return supportedOutToken[0];
};
