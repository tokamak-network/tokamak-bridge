import { calculateGasMargin } from "@/utils/gas/calculateGasMargin";
import { L2Provider, asL2Provider } from "@tokamak-network/titan-sdk";
import { ethers } from "ethers";
import { TransactionRequest } from "viem";

export async function calculateGasLimit(
  provider:
    | ethers.providers.JsonRpcProvider
    | L2Provider<ethers.providers.JsonRpcProvider>,
  tx: ethers.utils.Deferrable<ethers.providers.TransactionRequest>,
  isLayer2: boolean,
  uiValue?: boolean,
) {
  if (isLayer2 && uiValue) {
    const l2Provider = asL2Provider(provider);
    const estimatedGas = await l2Provider.estimateTotalGasCost(
      tx as TransactionRequest,
    );
    return calculateGasMargin(estimatedGas);
  }

  const estimatedGas = await provider.estimateGas(tx);
  return calculateGasMargin(estimatedGas);
}
