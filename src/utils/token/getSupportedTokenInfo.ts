import {
  supportedTokens,
  supportedTokensForCT,
} from "@/types/token/supportedToken";

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

export const getSupportedTokenForCT = (tokenAddress: string) => {
  const result = supportedTokensForCT
    .map((token) => {
      const supportedAddresses = Object.values(token.address);
      return supportedAddresses.includes(tokenAddress) ? token : null;
    })
    .filter((item) => item !== null)[0];

  return result;
};
