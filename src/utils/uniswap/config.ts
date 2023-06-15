import { Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import {
  WTON,
  DARIUS_TON,
  AURA,
  DARIUS_TOS,
  GOERLI_TON,
  GOERLI_TOS,
} from "./libs/constant";

// Sets if the example should run locally or on chain
export enum Environment {
  LOCAL,
  MAINNET,
  WALLET_EXTENSION,
}

// Inputs that configure this example to run
export interface ExampleConfig {
  env: Environment;
  rpc: {
    local: string;
    mainnet: string;
  };
  wallet: {
    address: string;
    privateKey: string;
  };
  tokens: {
    in: Token;
    amountIn: number;
    out: Token;
    poolFee: number;
  };
}

// Example Configuration

export const CurrentConfig: ExampleConfig = {
  env: Environment.WALLET_EXTENSION,
  rpc: {
    local: "http://localhost:8545",
    mainnet: "",
  },
  wallet: {
    address: process.env.NEXT_PUBLIC_WALLET_ADDRESS as string,
    privateKey: process.env.NEXT_PUBLIC_WALLET_PK as string,
  },
  tokens: {
    in: DARIUS_TOS,
    amountIn: 1,
    out: DARIUS_TON,
    poolFee: FeeAmount.MEDIUM,
  },
};
