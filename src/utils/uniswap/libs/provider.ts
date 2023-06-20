import { BaseProvider } from "@ethersproject/providers";
import { BigNumber, ethers, providers } from "ethers";

import { CurrentConfig, Environment } from "../config";
import { getL1Provider } from "@/config/l1Provider";
import { getL2Provider } from "@/config/l2Provider";

// Single copies of provider and wallet
const mainnetProvider = new ethers.providers.JsonRpcProvider(
  CurrentConfig.rpc.mainnet
);
const wallet = createWallet();

const browserExtensionProvider = createBrowserExtensionProvider();
let walletExtensionAddress: string | null = null;

// Interfaces

export enum TransactionState {
  Failed = "Failed",
  New = "New",
  Rejected = "Rejected",
  Sending = "Sending",
  Sent = "Sent",
}

// Provider and Wallet Functions

export function getMainnetProvider(): BaseProvider {
  return mainnetProvider;
}

export function getProvider(): providers.Provider | null {
  return CurrentConfig.env === Environment.WALLET_EXTENSION
    ? browserExtensionProvider
    : wallet.provider;
}

export function getWalletAddress(): string | null {
  // return CurrentConfig.env === Environment.WALLET_EXTENSION
  //   ? walletExtensionAddress
  //   : wallet.address;
  return process.env.NEXT_PUBLIC_WALLET_ADDRESS as string;
}

export async function sendTransaction(
  transaction: ethers.providers.TransactionRequest
): Promise<{
  provider:
    | ethers.providers.Web3Provider
    | ethers.providers.JsonRpcProvider
    | null;
  receiptHash: any;
  transactionState: TransactionState;
}> {
  if (CurrentConfig.env === Environment.WALLET_EXTENSION) {
    return sendTransactionViaExtension(transaction);
  } else {
    if (transaction.value) {
      transaction.value = BigNumber.from(transaction.value);
    }
    return sendTransactionViaWallet(transaction);
  }
}

export async function connectBrowserExtensionWallet() {
  if (!window.ethereum) {
    return null;
  }

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);

  if (accounts.length !== 1) {
    return;
  }

  walletExtensionAddress = accounts[0];
  return walletExtensionAddress;
}

// Internal Functionality
function createWallet(): ethers.Wallet {
  let provider = mainnetProvider;
  if (CurrentConfig.env == Environment.LOCAL) {
    provider = new ethers.providers.JsonRpcProvider(CurrentConfig.rpc.local);
  }
  return new ethers.Wallet(CurrentConfig.wallet.privateKey, provider);
}

function createBrowserExtensionProvider(): ethers.providers.Web3Provider | null {
  try {
    //@ts-ignore
    return new ethers.providers.Web3Provider(window?.ethereum, "any");
  } catch (e) {
    console.log("No Wallet Extension Found");
    return null;
  }
}

// Transacting with a wallet extension via a Web3 Provider
async function sendTransactionViaExtension(
  transaction: ethers.providers.TransactionRequest
): Promise<{
  provider: ethers.providers.Web3Provider | null;
  receiptHash: any;
  transactionState: TransactionState;
}> {
  try {
    const receiptHash = await browserExtensionProvider?.send(
      "eth_sendTransaction",
      [transaction]
    );

    if (receiptHash) {
      return {
        provider: browserExtensionProvider,
        receiptHash: receiptHash,
        transactionState: TransactionState.Sent,
      };
    } else {
      return {
        provider: browserExtensionProvider,
        receiptHash: receiptHash,
        transactionState: TransactionState.Failed,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      provider: browserExtensionProvider,
      receiptHash: undefined,
      transactionState: TransactionState.Rejected,
    };
  }
}

async function sendTransactionViaWallet(
  transaction: ethers.providers.TransactionRequest
): Promise<{
  provider: ethers.providers.JsonRpcProvider | null;
  receiptHash: any;
  transactionState: TransactionState;
}> {
  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value);
  }
  const txRes = await wallet.sendTransaction(transaction);

  let receipt = null;
  const provider = getL1Provider();
  if (!provider) {
    return {
      provider: null,
      receiptHash: undefined,
      transactionState: TransactionState.Failed,
    };
  }

  while (receipt === null) {
    try {
      receipt = await provider.getTransactionReceipt(txRes.hash);

      if (receipt === null) {
        continue;
      }
    } catch (e) {
      console.log(`Receipt error:`, e);
      break;
    }
  }

  // Transaction was successful if status === 1
  if (receipt) {
    return {
      provider: provider,
      receiptHash: receipt.transactionHash,
      transactionState: TransactionState.Sent,
    };
  } else {
    return {
      provider: provider,
      receiptHash: undefined,
      transactionState: TransactionState.Failed,
    };
  }
}
