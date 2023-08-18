import { ethers } from "ethers";

export function getL1Provider() {
  return new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_ETHEREUM_RPC
  );
}

export function getL1GoerliProvider() {
  return new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_GOERLI_RPC
  );
}
