import { useAccount, useBalance, useBlockNumber } from "wagmi";
import { ethers } from "ethers";
import commafy from "@/utils/trim/commafy";
import { WETH_ADDRESSES } from "@/types/token/supportedToken";
import { useMemo } from "react";

export default function useTokenBalance(
  address: `0x${string}` | string | null
) {
  const isETH = WETH_ADDRESSES.includes(address ?? "0x");
  const { address: accountAddress } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data, error, isLoading, isSuccess } = useBalance({
    address: accountAddress,
    token: isETH ? undefined : (address as "0x${string}") ?? null,
  });

  const tokenBalance = useMemo(() => {
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
  }, [blockNumber, accountAddress, data]);

  return tokenBalance;
}
