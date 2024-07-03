// index.tsx
export const TRANSACTION_CONSTANTS = {
  DEPOSIT: {
    INITIAL_MINUTES: 5, // Initial state time for deposit (in minutes)
  },
  WITHDRAW: {
    INITIAL_MINUTES: 11, // Initial state time for withdrawal (in minutes)
    ROLLUP_DAYS: 7, // Duration of the rollup state for withdrawal (in days)
  },
  CROSS_TRADE: {
    PROVIDE: 900, //15 minutes in seconds
    REQUEST: 300,
    CANCEL_REQUEST: 300,
  },
};
