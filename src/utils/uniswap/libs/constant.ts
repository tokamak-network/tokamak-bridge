import { GOERLI_CONTRACTS } from "@/constant/contracts/index";
import { SupportedChainId, Token } from "@uniswap/sdk-core";

export const POOL_FACTORY_CONTRACT_ADDRESS =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";
export const QUOTER_CONTRACT_ADDRESS =
  "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

// Currencies and Tokens

export const WTON = new Token(
  SupportedChainId.GOERLI,
  GOERLI_CONTRACTS.WTON_ADDRESS,
  27,
  "WTON",
  "Wrapped TON"
);

export const TOS = new Token(
  SupportedChainId.GOERLI,
  GOERLI_CONTRACTS.TOS_ADDRESS,
  18,
  "TOS",
  "TONStarter Token"
);

export const AURA = new Token(
  SupportedChainId.GOERLI,
  GOERLI_CONTRACTS.AURA_ADDRESS,
  18,
  "AURA",
  "AURA"
);
