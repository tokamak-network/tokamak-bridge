// index.tsx
export const TRANSACTION_CONSTANTS = {
  DEPOSIT: {
    INITIAL_MINUTES: 15, // Initial state time for deposit (in minutes)
    INITIAL_SECS: 900,
  },
  WITHDRAW: {
    INITIAL_MINUTES: 11, // Initial state time for withdrawal (in minutes)
    ROLLUP_MINUTES: 380, // Duration of the rollup  (in minutes)
    ROLLUP_SECS: 22800,
    ROLLUP_DAYS: 7, // Duration of the rollup state for withdrawal (in days)
    CHALLENGE_SECS: 604800,
  },
  CROSS_TRADE: {
    PROVIDE: 900, //15 minutes in seconds
    REQUEST: 300,
    CANCEL_REQUEST: 300,
    RETURN_LIQUIDITY: 300,
  },
};

export const TESTNET_TRANSACTION_CONSTANTS = {
  ...TRANSACTION_CONSTANTS,
  DEPOSIT: {
    INITIAL_MINUTES: 5,
    INITIAL_SECS: 300,
  },
  WITHDRAW: {
    ...TRANSACTION_CONSTANTS.WITHDRAW,
    ROLLUP_MINUTES: 720, // Duration of the rollup  (in minutes)
    ROLLUP_SECS: 43200,
  },
};

