import { useProvier } from "../provider/useProvider";
import useConnectedNetwork from "../network";
import { supportedChain } from "@/types/network/supportedNetwork";
import { useNetwork } from "wagmi";

export default function useGetTxLayers() {
  const { provider } = useProvier();
  const { layer, chainName, connectedChainId } = useConnectedNetwork();
  const { chain } = useNetwork();

  const returnProvider = (chainName: string | undefined) => {
    let l1Provider,
      l2Provider,
      l1BlockExplorer,
      l2BlockExplorer,
      l1ChainID,
      l2ChainID;
    switch (chainName) {
      case "TITAN":
        l1Provider = supportedChain.filter((e) => e.chainName === "MAINNET")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "TITAN")[0];
        l1BlockExplorer = "https://etherscan.io";
        l2BlockExplorer = "https://explorer.titan.tokamak.network/";
        l1ChainID = 1;
        l2ChainID = 55004;
        return {
          l1Provider,
          l2Provider,
          l1BlockExplorer,
          l2BlockExplorer,
          l1ChainID,
          l2ChainID,
        };

      case "MAINNET":
        l1Provider = supportedChain.filter((e) => e.chainName === "MAINNET")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "TITAN")[0];
        l1BlockExplorer = "https://etherscan.io";
        l2BlockExplorer = "https://explorer.titan.tokamak.network/";
        l1ChainID = 1;
        l2ChainID = 55004;
        return {
          l1Provider,
          l2Provider,
          l1BlockExplorer,
          l2BlockExplorer,
          l1ChainID,
          l2ChainID,
        };

      default:
        l1Provider = supportedChain.filter((e) => e.chainName === "MAINNET")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "TITAN")[0];
        l1BlockExplorer = "https://etherscan.io";
        l2BlockExplorer = "https://explorer.titan.tokamak.network/";
        l1ChainID = 1;
        l2ChainID = 55004;
        return {
          l1Provider,
          l2Provider,
          l1BlockExplorer,
          l2BlockExplorer,
          l1ChainID,
          l2ChainID,
        };
    }
  };

  const providers = returnProvider(chainName);

  return providers;
}
