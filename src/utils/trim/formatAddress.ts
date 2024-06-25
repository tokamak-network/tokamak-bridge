export const formatAddress = (address: string | undefined) => {
  const formattedAddress = address?.substring(2);
  return formattedAddress;
};
