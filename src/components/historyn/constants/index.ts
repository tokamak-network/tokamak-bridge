import { Status } from "@/components/historyn/types";

// index.tsx
export const TRANSACTION_CONSTANTS = {
  DEPOSIT: {
    INITIAL_MINUTES: 1, // Initial state time for deposit (in minutes)
  },
  WITHDRAW: {
    INITIAL_MINUTES: 11, // Initial state time for withdrawal (in minutes)
    ROLLUP_DAYS: 7, // Duration of the rollup state for withdrawal (in days)
  },
};

// This can be moved to an env file later
export const BLOCKEXPLORER_CONSTANTS = {
  MAINNET: "https://etherscan.io",
  SEPOLIA: "https://sepolia.etherscan.io",
  TITAN_SEPOLIA: "https://explorer.titan-sepolia.tokamak.network",
  TITAN: "https://explorer.titan.tokamak.network",
};

export const STATUS_CONFIG = {
  WITHDRAW: [Status.Initiate, Status.Rollup, Status.Finalize],
  DEPOSIT: [Status.Initiate, Status.Finalize],
};
