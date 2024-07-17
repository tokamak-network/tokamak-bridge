import { ZERO_ADDRESS } from "@/constant/misc";

export const isZeroAddress = (address: string): boolean => {
  return address === ZERO_ADDRESS;
};
