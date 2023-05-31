import { Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import { WTON, TOS } from "./libs/constant";

// Inputs that configure this example to run
export interface ExampleConfig {
  rpc: {
    local: string;
    mainnet: string;
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
  rpc: {
    local: "http://localhost:8545",
    mainnet: "",
  },
  tokens: {
    in: TOS,
    amountIn: 1000000,
    out: WTON,
    poolFee: FeeAmount.MEDIUM,
  },
};
