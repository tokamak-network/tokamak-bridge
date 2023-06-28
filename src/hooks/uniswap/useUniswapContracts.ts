import {
  L1_UniswapContracts,
  L2_UniswapContracts,
  L2_TESTNET_UniswapContracts,
} from "@/constant/contracts/uniswap";
import useConnectedNetwork, { useInOutNetwork } from "../network";
import { ethers } from "ethers";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { useProvier } from "@/hooks/provider/useProvider";

export function useUniswapContracts() {
  const { inNetwork } = useInOutNetwork();
  const { provider } = useProvier();
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  const UNISWAP_CONTRACT =
    inNetwork?.layer === "L1"
      ? L1_UniswapContracts
      : isConnectedToMainNetwork
      ? L2_UniswapContracts
      : L2_TESTNET_UniswapContracts;

  const QUOTER_CONTRACT = new ethers.Contract(
    UNISWAP_CONTRACT.QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    provider
  );

  return { UNISWAP_CONTRACT, QUOTER_CONTRACT };
}
