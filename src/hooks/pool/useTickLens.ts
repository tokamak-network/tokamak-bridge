import { TICK_LENS_ADDRESSES } from "@uniswap/sdk-core";
import { TickLens } from "types/v3";
import useConnectedNetwork from "../network";
import { Contract } from "ethers";
import { useAccount } from "wagmi";
import { useProvier } from "../provider/useProvider";
import { useMemo } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { isAddress } from "viem";
import { ADDRESS_ZERO } from "@uniswap/v3-sdk";
import { getProviderOrSigner } from "@/utils/web3/getEthersProviderOrSinger";
import TickLensJson from "@uniswap/v3-periphery/artifacts/contracts/lens/TickLens.sol/TickLens.json";
import {
  L1_SEPOLIA_UniswapContracts,
  L2_THANOS_SEPOLIA_UniswapContracts,
  L2_UniswapContracts,
} from "@/constant/contracts/uniswap";

export function getContract(
  address: string,
  ABI: any,
  provider: JsonRpcProvider,
  account?: string
): Contract {
  if (!isAddress(address) || address === ADDRESS_ZERO) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(provider, account) as any
  );
}

// returns null on errors
function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { address: account } = useAccount();
  const { connectedChainId: chainId } = useConnectedNetwork();
  const { provider } = useProvier();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === "string") address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(
        address,
        ABI,
        provider,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [
    addressOrAddressMap,
    ABI,
    provider,
    chainId,
    withSignerIfPossible,
    account,
  ]) as T;
}

const TICK_LENS_ADDRESSES_WITH_TITAN: { [chainId: number]: string } = {
  ...TICK_LENS_ADDRESSES,
  [55004]: L2_UniswapContracts.TICK_LENS,
  [5050]: L2_THANOS_SEPOLIA_UniswapContracts.TICK_LENS,
  [11155111]: L1_SEPOLIA_UniswapContracts.TICK_LENS,
};

export function useTickLens(): TickLens | null {
  const { connectedChainId: chainId } = useConnectedNetwork();
  const address = chainId ? TICK_LENS_ADDRESSES_WITH_TITAN[chainId] : undefined;

  //here to return TICKLENS_CONTRACT to each network
  return useContract(address, TickLensJson) as TickLens | null;
}
