import {
  L1_UniswapContracts,
  L1_SEPOLIA_UniswapContracts,
  L2_UniswapContracts,
  L2_TESTNET_UniswapContracts,
} from "@/constant/contracts/uniswap";
import useConnectedNetwork, { useInOutNetwork } from "../network";
import { ethers } from "ethers";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { useProvier } from "@/hooks/provider/useProvider";

export function useUniswapContracts() {
  const { layer } = useConnectedNetwork();
  const { provider } = useProvier();
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  let selectedUniswapContracts;

  switch (true) {
    case layer === "L1" && isConnectedToMainNetwork:
      selectedUniswapContracts = L1_UniswapContracts;
      break;
    case layer === "L1" && !isConnectedToMainNetwork:
      selectedUniswapContracts = L1_SEPOLIA_UniswapContracts;
      break;
    case layer === "L2" && isConnectedToMainNetwork:
      selectedUniswapContracts = L2_UniswapContracts;
      break;
    default:
      selectedUniswapContracts = L2_TESTNET_UniswapContracts;
      break;
  }

  const UNISWAP_CONTRACT = selectedUniswapContracts;

  let selectedContracts;

  switch (true) {
    case layer === "L1" && isConnectedToMainNetwork:
      selectedContracts = L2_UniswapContracts;
      break;
    case layer === "L1" && !isConnectedToMainNetwork:
      selectedContracts = L2_TESTNET_UniswapContracts;
      break;
    case layer === "L2" && isConnectedToMainNetwork:
      selectedContracts = L1_UniswapContracts;
      break;
    default:
      selectedContracts = L1_SEPOLIA_UniswapContracts;
  }

  const UNISWAP_CONTRACT_OTHER_LAYER = selectedContracts;

  return {
    UNISWAP_CONTRACT,
    UNISWAP_CONTRACT_OTHER_LAYER,
    L1_UniswapContracts,
    L2_UniswapContracts,
    L2_TESTNET_UniswapContracts,
  };
}
