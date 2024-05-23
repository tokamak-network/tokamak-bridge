import { BigNumber, ethers } from "ethers";

export function getTotalGasCostUSD(
  estimatedGasUsage: BigNumber | number,
  gasPrice: bigint | null,
  ethPrice: number,
  layer: "L1" | "L2" | undefined
) {
  const totalGasCost = Number(gasPrice) * Number(estimatedGasUsage.toString());
  const parsedTotalGasCost = ethers.utils.formatUnits(
    layer === "L2" ? estimatedGasUsage.toString() : totalGasCost.toString(),
    "ether"
  );
  const totalGasCostUSD =
    Number(parsedTotalGasCost.replaceAll(",", "")) * ethPrice;

  return totalGasCostUSD;
}
