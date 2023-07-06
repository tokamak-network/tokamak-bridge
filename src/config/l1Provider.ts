import { ethers } from "ethers";

export function getL1Provider() {
  return new ethers.providers.JsonRpcProvider(process.env.EthereumProvider);
}
