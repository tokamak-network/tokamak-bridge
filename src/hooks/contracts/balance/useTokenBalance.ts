import { useAccount, useBalance } from "wagmi";
import { ethers } from "ethers";
import commafy from "@/utils/trim/commafy";
import { TokenInfo } from "@/types/token/supportedToken";
import { useMemo } from "react";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";

export default function useTokenBalance(
  tokenInfo: TokenInfo | null,
  requireCall?: boolean,
  watch?: boolean,
) {
  const { chainName } = useConnectedNetwork();

  const isETH = tokenInfo?.isNativeCurrency?.includes(
    SupportedChainId.MAINNET ||
      SupportedChainId.TITAN ||
      SupportedChainId.SEPOLIA,
  );
  const tokenAddress = chainName && tokenInfo?.address[chainName];
  const { address: accountAddress } = useAccount();
  const { isInTokenOpen, isOutTokenOpen } = useTokenModal();
  const { inToken, outToken } = useInOutTokens();
  const isOnUI =
    inToken?.address === tokenAddress || outToken?.address === tokenAddress;
  const { isLayer2 } = useConnectedNetwork();
  const { data, error, isLoading, isSuccess } = useBalance({
    address: accountAddress,
    token:
      (isETH && chainName !== "THANOS_SEPOLIA") ||
      (chainName === "THANOS_SEPOLIA" && tokenInfo?.tokenSymbol === "TON")
        ? undefined
        : ((tokenAddress as "0x${string}") ?? null),
    watch: isInTokenOpen || isOutTokenOpen ? true : watch,
    staleTime: isLayer2 ? 2000 : 5000,
    // enabled: requireCall,
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
              data.decimals as number,
            ),
          ),
          parsedBalanceWithoutCommafied: commafy(
            ethers.utils.formatUnits(
              //@ts-ignore
              typeof data.value === "bigint" ? data.value : "0",
              data.decimals as number,
            ),
            data.decimals as number,
          ).replaceAll(",", ""),
        },
        error,
        isLoading,
        isSuccess,
      };
    }
    return null;
  }, [accountAddress, data]);

  return tokenBalance;
}
