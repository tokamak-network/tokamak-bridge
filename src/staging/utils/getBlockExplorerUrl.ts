import { SupportedChainId } from "@/types/network/supportedNetwork";
import { BLOCKEXPLORER_CONSTANTS } from "@/staging/constants/blockexplorer";

export default function getBlockExplorerUrl(chainId: SupportedChainId) {
  return BLOCKEXPLORER_CONSTANTS[chainId];
}
