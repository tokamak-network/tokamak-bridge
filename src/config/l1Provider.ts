import { ethers } from "ethers";

export function getL1Provider() {
  return new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_INFURA_RPC_ETHEREUM
  );
}
