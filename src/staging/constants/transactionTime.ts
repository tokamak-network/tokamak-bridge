// index.tsx
export const TRANSACTION_CONSTANTS = {
  DEPOSIT: {
    INITIAL_MINUTES: 15, // Initial state time for deposit (in minutes)
    INITIAL_SECS: 915, // Set to 915 seconds for UI purposes, although the spec is 900 seconds
  },
  WITHDRAW: {
    INITIAL_MINUTES: 11, // Initial state time for withdrawal (in minutes)
    ROLLUP_MINUTES: 360, // Duration of the rollup  (in minutes)
    ROLLUP_SECS: 21600,
    ROLLUP_DAYS: 7, // Duration of the rollup state for withdrawal (in days)
    CHALLENGE_SECS: 604800,
  },
  // Set to 15sec time-buffer for UI purposes, although the spec is 900 seconds
  CROSS_TRADE: {
    PROVIDE: 915, //15 minutes in seconds
    REQUEST: 915, 
    CANCEL_REQUEST: 915,
    RETURN_LIQUIDITY: 915,
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
