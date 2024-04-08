import {
  L1_UniswapContracts,
  L1_SEPOLIA_UniswapContracts,
  L2_UniswapContracts,
  L2_THANOS_SEPOLIA_UniswapContracts,
  L2_TITAN_SEPOLIA_UniswapContracts,
} from "@/constant/contracts/uniswap";
import useConnectedNetwork, { useInOutNetwork } from "../network";
import { ethers } from "ethers";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { useProvier } from "@/hooks/provider/useProvider";
import { SupportedChainId } from "@/types/network/supportedNetwork";

export function useUniswapContracts() {
  const { layer, connectedChainId } = useConnectedNetwork();
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
    case layer === "L2" &&
      !isConnectedToMainNetwork &&
      connectedChainId === SupportedChainId["THANOS_SEPOLIA"]:
      L2_THANOS_SEPOLIA_UniswapContracts;
    default:
      selectedUniswapContracts = L2_TITAN_SEPOLIA_UniswapContracts;
      break;
  }

  const UNISWAP_CONTRACT = selectedUniswapContracts;

  let selectedContracts;

  switch (true) {
    case layer === "L1" && isConnectedToMainNetwork:
      selectedContracts = L2_UniswapContracts;
      break;
    case layer === "L1" && !isConnectedToMainNetwork:
      selectedContracts = L2_THANOS_SEPOLIA_UniswapContracts;
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
    L2_THANOS_SEPOLIA_UniswapContracts,
  };
}
