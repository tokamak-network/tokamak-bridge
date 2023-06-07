import { useAccount, useBalance, useContractRead } from "wagmi";
import { ethers } from "ethers";
import commafy from "@/utils/trim/commafy";

export default function useTokenBalance(
  address: `0x${string}` | string | null
) {
  const isETH = address === "0x";
  const { address: accountAddress } = useAccount();
  const { data, error, isLoading, isSuccess } = useBalance({
    address: accountAddress,
    token: isETH ? undefined : (address as "0x${string}") ?? "0x",
  });

  if (data) {
    return {
      data: {
        balanceBN: data,
        parsedBalance: commafy(
          ethers.utils.formatUnits(
            //@ts-ignore
            typeof data.value === "bigint" ? data.value : "0",
            data.decimals as number
          )
        ),
        parsedBalanceWithoutCommafied: commafy(
          ethers.utils.formatUnits(
            //@ts-ignore
            typeof data.value === "bigint" ? data.value : "0",
            data.decimals as number
          ),
          data.decimals as number
        ),
      },
      error,
      isLoading,
      isSuccess,
    };
  }
  return null;
}
