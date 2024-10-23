import { BigNumber } from "@ethersproject/bignumber";
import { L2Provider, asL2Provider } from "@tokamak-network/titan-sdk";
import { ethers } from "ethers";
import { TransactionRequest } from "viem";

/**
 * Returns the gas value plus a margin for unexpected or variable gas costs
 * @param value the gas value to pad
 */
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(125).div(100);
}

export function calculateGasMarginBigInt(value: bigint): bigint {
  return (value * BigInt(125)) / BigInt(100);
}

export async function getSingleCalldataGasLimit(
  provider: ethers.providers.JsonRpcProvider,
  txData: ethers.utils.Deferrable<ethers.providers.TransactionRequest>,
  callData: string,
  isLayer2: boolean,
  uiValue?: boolean
) {
  if (isLayer2 && uiValue) {
    const l2Provider = asL2Provider(provider);
    const estimatedGas = await l2Provider.estimateTotalGasCost({
      ...(txData as TransactionRequest),
      data: callData,
    });
    return calculateGasMargin(estimatedGas);
  }
  const estimatedGasUsage = await provider.estimateGas({
    ...txData,
    data: callData,
  });
  return calculateGasMargin(estimatedGasUsage);
}
