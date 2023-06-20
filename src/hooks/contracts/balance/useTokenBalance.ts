import { useAccount, useBalance, useBlockNumber } from "wagmi";
import { ethers } from "ethers";
import commafy from "@/utils/trim/commafy";
import { TokenInfo } from "@/types/token/supportedToken";
import { useMemo } from "react";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";

export default function useTokenBalance(tokenInfo: TokenInfo | null) {
  const { chainName, layer } = useConnectedNetwork();

  const isETH =
    layer === "L1" &&
    tokenInfo?.isNativeCurrency?.includes(
      SupportedChainId.MAINNET || SupportedChainId.GOERLI
    );
  const tokenAddress = chainName && tokenInfo?.address[chainName];

  const { address: accountAddress } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data, error, isLoading, isSuccess } = useBalance({
    address: accountAddress,
    token: isETH ? undefined : (tokenAddress as "0x${string}") ?? null,
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
