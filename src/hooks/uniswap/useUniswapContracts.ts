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
  const { layer } = useConnectedNetwork();
  const { provider } = useProvier();
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  const UNISWAP_CONTRACT =
    layer === "L1"
      ? L1_UniswapContracts
      : isConnectedToMainNetwork
      ? L2_UniswapContracts
      : L2_TESTNET_UniswapContracts;

  const QUOTER_CONTRACT = new ethers.Contract(
    UNISWAP_CONTRACT.QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    provider
  );

  const UNISWAP_CONTRACT_OTHER_LAYER =
    layer === "L1" && isConnectedToMainNetwork
      ? L2_UniswapContracts
      : layer === "L1" && !isConnectedToMainNetwork
      ? L2_TESTNET_UniswapContracts
      : L1_UniswapContracts;

  return { UNISWAP_CONTRACT, QUOTER_CONTRACT, UNISWAP_CONTRACT_OTHER_LAYER };
}
