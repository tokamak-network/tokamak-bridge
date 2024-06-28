import EthNetworkSymbol from "@/assets/icons/newHistory/eth-n-symbol.svg";
import TitanNetworkSymbol from "@/assets/icons/newHistory/titan-n-symbol.svg";
import ThanosNetworkSymbol from "@/assets/icons/newHistory/thanos-n-symbol.svg";
import { SupportedChainId } from "@/types/network/supportedNetwork";

const fetchNetworkImage = (network: number) => {
  if (
    network === SupportedChainId.MAINNET ||
    network === SupportedChainId.SEPOLIA
  ) {
    return { src: EthNetworkSymbol, alt: "EthNetworkSymbol" };
  }
  if (network === SupportedChainId.THANOS_SEPOLIA) {
    return { src: ThanosNetworkSymbol, alt: "ThanosNetworkSymbol" };
  }
  return { src: TitanNetworkSymbol, alt: "TitanNetworkSymbol" };
};

export default fetchNetworkImage;
