import { useProvier } from "../provider/useProvider";
import useConnectedNetwork from "../network";
import { supportedChain } from "@/types/network/supportedNetwork";
import { useNetwork } from "wagmi";

export default function useGetTxLayers() {
  const { provider } = useProvier();
  const { layer, chainName, connectedChainId } = useConnectedNetwork();
  const { chain } = useNetwork();

  const returnProvider = (chainName: string | undefined) => {
    let l1Provider, l2Provider, l1BlockExplorer, l2BlockExplorer;
    switch (chainName) {
      case "DARIUS":
        l1Provider = supportedChain.filter((e) => e.chainName === "GOERLI")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "DARIUS")[0];
        l1BlockExplorer = "https://goerli.etherscan.io";
        l2BlockExplorer = "https://goerli.explorer.tokamak.network";
        return { l1Provider, l2Provider, l1BlockExplorer, l2BlockExplorer };

      case "TITAN":
        l1Provider = supportedChain.filter((e) => e.chainName === "MAINNET")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "TITAN")[0];
        l1BlockExplorer = "https://etherscan.io";
        l2BlockExplorer = "https://explorer.titan.tokamak.network";

        return { l1Provider, l2Provider, l1BlockExplorer, l2BlockExplorer };

      case "GOERLI":
        l1Provider = supportedChain.filter((e) => e.chainName === "GOERLI")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "DARIUS")[0];
        l1BlockExplorer = "https://goerli.etherscan.io";
        l2BlockExplorer = "https://goerli.explorer.tokamak.network";

        return { l1Provider, l2Provider, l1BlockExplorer, l2BlockExplorer };

      case "MAINNET":
        l1Provider = supportedChain.filter((e) => e.chainName === "MAINNET")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "TITAN")[0];
        l1BlockExplorer = "https://etherscan.io";
        l2BlockExplorer = "https://explorer.titan.tokamak.network";

        return { l1Provider, l2Provider, l1BlockExplorer, l2BlockExplorer };
      default:
        l1Provider = supportedChain.filter((e) => e.chainName === "MAINNET")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "TITAN")[0];
        l1BlockExplorer = "https://etherscan.io";
        l2BlockExplorer = "https://explorer.titan.tokamak.network";
        return { l1Provider, l2Provider, l1BlockExplorer, l2BlockExplorer };
    }
  };

  const providers = returnProvider(chainName);

  return providers;
}
