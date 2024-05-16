import { vi } from "vitest";
import { mockInToken, mockOutToken } from "./useSmartRouter.mock";

export const mockWagmi = () => {
  console.log("mockWagmi called");
  vi.doMock("wagmi", async (importOriginal) => {
    const actual = await importOriginal<typeof import("wagmi")>();
    return {
      ...actual,
      useAccount: () => ({
        address: "0x8091C2fD8a79a9EF812d487052496243f6825B02",
      }),
    };
  });
};

export const mockUseInOutTokens = () => {
  vi.doMock("@/hooks/token/useInOutTokens", () => ({
    useInOutTokens: () => ({
      inToken: mockInToken,
      outToken: mockOutToken,
    }),
  }));
};

export const mockNetwork = () => {
  vi.doMock("@/hooks/network/", () => ({
    __esModule: true,
    default: () => ({
      layer: "L1",
      isConnectedToMainNetwork: false,
      connectedChainId: 11155111,
    }),
  }));
};

export const mockUseGetMode = () => {
  vi.doMock("@/hooks/mode/useGetMode", () => ({
    useGetMode: () => ({ mode: "Swap" }),
  }));
};
