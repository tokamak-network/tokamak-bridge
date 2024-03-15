import { providerByChainId } from "@/config/getProvider";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { calculateGasMargin } from "@/utils/gas/calculateGasMargin";
//@ts-ignore
import * as titanSDK from "@tokamak-network/tokamak-layer2-sdk";
import { BigNumber, Contract, ethers } from "ethers";

export async function calculateGasLimit(
  provider: ethers.providers.JsonRpcProvider,
  tx: ethers.utils.Deferrable<ethers.providers.TransactionRequest>,
  isLayer2: boolean,
  isConnectedToMainNetwork: boolean | undefined
) {
  if (!isLayer2) {
    const estimatedGas = await provider.estimateGas(tx);
    return calculateGasMargin(estimatedGas);
  }

  // if (isLayer2 && !isConnectedToMainNetwork) {
  //   const gasPrice = await provider.getGasPrice();
  //   const l2ProSDK = titanSDK.asL2Provider(
  //     providerByChainId[
  //       isConnectedToMainNetwork
  //         ? SupportedChainId.TITAN
  //         : SupportedChainId.DARIUS
  //     ]
  //   );
  //   const totalGasCost = await l2ProSDK.estimateTotalGasCost(tx);
  //   const estimatedGas = BigNumber.from(totalGasCost).div(gasPrice);
  //   return calculateGasMargin(estimatedGas);
  // }

  try {
    const estimatedGas = await provider.estimateGas(tx);
    return calculateGasMargin(estimatedGas);
  } catch (e) {
    console.log(e);
  }

  // const gasPrice = await provider.getGasPrice();
  // const l2ProSDK = titanSDK.asL2Provider(
  //   providerByChainId[
  //     isConnectedToMainNetwork
  //       ? SupportedChainId.TITAN
  //       : SupportedChainId.DARIUS
  //   ]
  // );
  // const totalGasCost = await l2ProSDK.estimateTotalGasCost(tx);
  // const estimatedGas = BigNumber.from(totalGasCost).div(gasPrice);
  // return calculateGasMargin(estimatedGas);
}
