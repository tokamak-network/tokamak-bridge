import contracts from "@/constant/contracts";
import { SupportedChainId } from "@/types/network/supportedNetwork";

export function getTokenAddress(outNetwork: SupportedChainId) {
  const {
    MAINNET_CONTRACTS,
    GOERLI_CONTRACTS,
    TOKAMAK_CONTRACTS,
    TOKAMAK_GOERLI_CONTRACTS,
  } = contracts;
}
