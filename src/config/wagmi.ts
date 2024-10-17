import { configureChains, createConfig } from "wagmi";
// import { mainnet, sepolia } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "@wagmi/connectors/injected";
import { MetaMaskConnector } from "@wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import {
  mainnet,
  sepolia,
  titan,
  titan_sepolia,
  thanos_sepolia,
} from "./tokamakProvider";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, titan, titan_sepolia, sepolia, thanos_sepolia],
  [publicProvider()],
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});
