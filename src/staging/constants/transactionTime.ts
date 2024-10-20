import { SupportedChainId } from "@/types/network/supportedNetwork";
import { isThanosChain } from "@/utils/network/checkNetwork";

// index.tsx
export const TRANSACTION_CONSTANTS = {
  DEPOSIT: {
    INITIAL_MINUTES: 5, // Initial state time for deposit (in minutes)
    INITIAL_SECS: 300,
  },
  WITHDRAW: {
    INITIAL_MINUTES: 11, // Initial state time for withdrawal (in minutes)
    ROLLUP_MINUTES: 360, // Duration of the rollup  (in minutes)
    ROLLUP_SECS: 21600,
    ROLLUP_DAYS: 7, // Duration of the rollup state for withdrawal (in days)
    CHALLENGE_PERIOD: 7 * 24 * 60,
    PROVE: 0.5,
    CHALLENGE_SECS: 604800,
  },
  CROSS_TRADE: {
    PROVIDE: 900, //15 minutes in seconds
    REQUEST: 300,
    CANCEL_REQUEST: 300,
    RETURN_LIQUIDITY: 300,
  },
};

export const getTransactionConstants = (chain: SupportedChainId) => {
  if (chain === SupportedChainId.THANOS_SEPOLIA) {
    return {
      ...TRANSACTION_CONSTANTS,
      DEPOSIT: { INITIAL_MINUTES: 2 },
      WITHDRAW: { INITIAL_MINUTES: 60, CHALLENGE_PERIOD: 0.2, PROVE: 0.3 },
    };
  } else return TRANSACTION_CONSTANTS;
};
