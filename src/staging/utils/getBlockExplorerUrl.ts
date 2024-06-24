import { SupportedChainId } from "@/types/network/supportedNetwork";
import { BLOCKEXPLORER_CONSTANTS } from "@/staging/constants/blockexplorer";

export default function getBlockExplorerUrl(chainId: SupportedChainId) {
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return BLOCKEXPLORER_CONSTANTS.MAINNET;
    case SupportedChainId.TITAN:
      return BLOCKEXPLORER_CONSTANTS.TITAN;
    case SupportedChainId.SEPOLIA:
      return BLOCKEXPLORER_CONSTANTS.SEPOLIA;
    case SupportedChainId.TITAN_SEPOLIA:
      return BLOCKEXPLORER_CONSTANTS.TITAN_SEPOLIA;
    // 필요한 경우 다른 체인 ID도 추가
    default:
      undefined;
  }
}
