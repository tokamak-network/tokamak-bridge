import useConnectedNetwork from "../network";
import { GOERLI_CONTRACTS, MAINNET_CONTRACTS } from "@/constant/contracts";

export function useTONAddress() {
  const { connectedChainId } = useConnectedNetwork();
  const TON_ADDRESS =
    connectedChainId === 1
      ? MAINNET_CONTRACTS.TON_ADDRESS
      : GOERLI_CONTRACTS.TON_ADDRESS;
  const WTON_ADDRESS =
    connectedChainId === 1
      ? MAINNET_CONTRACTS.WETH_ADDRESS
      : GOERLI_CONTRACTS.WTON_ADDRESS;

  return { TON_ADDRESS, WTON_ADDRESS };
}
