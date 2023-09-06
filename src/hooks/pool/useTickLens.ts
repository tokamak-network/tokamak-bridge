import { TICK_LENS_ADDRESSES } from "@uniswap/sdk-core";
import { TickLens } from "types/v3";
import useConnectedNetwork from "../network";

export function useTickLens(): TickLens | null {
  const { connectedChainId: chainId } = useConnectedNetwork();
  const address = chainId ? TICK_LENS_ADDRESSES[chainId] : undefined;

  return null;
  //here to return TICKLENS_CONTRACT to each network
  //   return useContract(address, TickLensABI) as TickLens | null;
}
