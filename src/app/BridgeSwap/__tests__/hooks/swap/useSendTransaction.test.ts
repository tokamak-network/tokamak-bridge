import { renderHook, act } from "@testing-library/react";
import { useSendTransaction } from "wagmi";
import {
  txData,
  mockTxSuccess,
  mockTxFail,
} from "./__mocks__/useSendTransaction.mock";
import { expect, describe, it, vi } from "vitest";

vi.mock("wagmi", () => ({
  useSendTransaction: vi.fn(),
}));

const mockedUseSendTransaction = vi.mocked(useSendTransaction);

describe("useSendTransaction 훅 테스트", () => {
  it("트랜잭션 성공 시", async () => {
    mockedUseSendTransaction.mockReturnValue(mockTxSuccess);
    const { result } = renderHook(() => useSendTransaction(txData));

    await act(async () => {
      await result.current.sendTransaction();
    });

    const { data, isError, isSuccess } = result.current;
    expect(isError).toBe(false);
    expect(isSuccess).toBe(true);
    expect(data).toEqual(mockTxSuccess.data);
  });

  it("트랜잭션 실패 시", async () => {
    mockedUseSendTransaction.mockReturnValue(mockTxFail);
    const { result } = renderHook(() => useSendTransaction(txData));

    await act(async () => {
      try {
        await result.current.sendTransaction();
      } catch (e: any) {
        expect(e.message).toBe("Transaction failed");
      }
    });

    const { data, isError, isSuccess } = result.current;
    expect(isError).toBe(true);
    expect(isSuccess).toBe(false);
    expect(data).toBeUndefined();
  });
});
