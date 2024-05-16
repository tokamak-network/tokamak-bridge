//useSendTransaction Mock
import { vi } from "vitest";

export const txData: any = {
  to: "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E",
  data: "0x5ae401dc0000000000000000000000000000000000000000000000000000000066430ecd",
  value: "0x00",
  from: "0x8091C2fD8a79a9EF812d487052496243f6825B02",
};

export const mockTxSuccess = {
  data: {
    hash: "0xed2bf9f9e9cffbb7b246f265fb81770aba0f86d07212639fe68a97749957f828" as `0x${string}`,
  },
  error: null,
  isError: false,
  isIdle: false,
  isLoading: false,
  isSuccess: true,
  reset: vi.fn(),
  sendTransaction: vi.fn().mockResolvedValue({
    data: {
      hash: "0xed2bf9f9e9cffbb7b246f265fb81770aba0f86d07212639fe68a97749957f828" as `0x${string}`,
    },
  }),
  sendTransactionAsync: vi.fn(),
  status: "success" as "error" | "success" | "loading" | "idle",
  variables: {},
};

export const mockTxFail = {
  data: undefined,
  error: new Error("Transaction failed"),
  isError: true,
  isIdle: false,
  isLoading: false,
  isSuccess: false,
  reset: vi.fn(),
  sendTransaction: vi.fn().mockRejectedValue(new Error("Transaction failed")),
  sendTransactionAsync: vi.fn(),
  status: "error" as "error" | "success" | "loading" | "idle",
  variables: {},
};

//
