import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";

/**
 * Returns the gas value plus a margin for unexpected or variable gas costs
 * @param value the gas value to pad
 */
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(120).div(100);
}

export async function getSingleCalldataGasLimit(
  provider: ethers.providers.JsonRpcProvider,
  txData: ethers.utils.Deferrable<ethers.providers.TransactionRequest>,
  callData: string
) {
  const estimatedGasUsage = await provider.estimateGas({
    ...txData,
    data: callData,
  });
  return calculateGasMargin(estimatedGasUsage);
}
