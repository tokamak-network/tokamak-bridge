import {
  L1_UniswapContracts,
  L2_UniswapContracts,
} from "@/constant/contracts/uniswap";
import { useInOutNetwork } from "../network";

export function useUniswapContracts() {
  const { inNetwork } = useInOutNetwork();

  const UNISWAP_CONTRACT =
    inNetwork?.layer === "L1" ? L1_UniswapContracts : L2_UniswapContracts;

  return { UNISWAP_CONTRACT };
}
