import {
  supportedTokens,
  supportedTokensForCT,
} from "@/types/token/supportedToken";

function checkIfTokenAddressExists(
  tokenAddress: string,
  address: Object
): string | null {
  for (const [network, contractAddress] of Object.entries(address)) {
    if (
      contractAddress.toLocaleLowerCase() === tokenAddress.toLocaleLowerCase()
    ) {
      return network;
    }
  }
  return null;
}

export const getSupportedTokenInfo = (params: {
  tokenAddress: string;
  networkName: string;
  tokenSymbol: string;
}) => {
  const { tokenAddress, networkName, tokenSymbol } = params;
  const supportedOutToken = supportedTokens.filter((token) => {
    if (token.tokenSymbol === tokenSymbol) {
      return token;
    }
  });

  if (supportedOutToken) return supportedOutToken[0];
};

export const getSupportedTokenForCT = (tokenAddress: string) => {
  const result = supportedTokensForCT
    .map((token) => {
      const supportedAddresses = Object.values(token.address);
      const isIncluded = supportedAddresses.some(
        (address) => address?.toLowerCase() === tokenAddress.toLowerCase()
      );

      //need to refactor index later
      //it's only for test demo now
      return isIncluded &&
        supportedAddresses[4]?.toLocaleLowerCase() ===
          tokenAddress.toLocaleLowerCase()
        ? token
        : null;
    })
    .filter((item) => item !== null)[0];

  return result;
};
