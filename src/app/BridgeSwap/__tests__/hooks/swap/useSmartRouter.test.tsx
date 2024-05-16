import { renderHook, waitFor } from "@testing-library/react";
import { useSmartRouter } from "@/hooks/uniswap/useSmartRouter";
import { server } from "@/app/BridgeSwap/__tests__/hooks/swap/__config__/useSmartRouterConfig";
import {
  expect,
  describe,
  it,
  beforeEach,
  beforeAll,
  afterEach,
  afterAll,
  vi,
} from "vitest";
import {
  mockInToken,
  mockOutToken,
  mockRoutingPathData,
} from "./__mocks__/useSmartRouter.mock";

import { setupTestWrapper } from "./__config__/setupTest";

vi.mock("wagmi", async (importOriginal) => {
  const actual = await importOriginal<typeof import("wagmi")>();
  return {
    ...actual,
    useAccount: () => ({
      address: "0x8091C2fD8a79a9EF812d487052496243f6825B02",
    }),
  };
});

vi.mock("@/hooks/token/useInOutTokens", () => ({
  useInOutTokens: () => ({
    inToken: mockInToken,
    outToken: mockOutToken,
  }),
}));

vi.mock("@/hooks/network/", () => ({
  __esModule: true,
  default: () => ({
    layer: "L1",
    isConnectedToMainNetwork: false,
    connectedChainId: 11155111,
  }),
}));

vi.mock("@/hooks/mode/useGetMode", () => ({
  useGetMode: () => ({ mode: "Swap" }),
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

afterEach(() => {
  // 각 테스트 후 핸들러 재설정
  server.resetHandlers();
});

describe("useSmartRouter hook", () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("should fetch routing path data successfully", async () => {
    const { result } = renderHook(() => useSmartRouter(), {
      wrapper: setupTestWrapper,
    });

    await waitFor(() =>
      expect(result.current.routingPath).toEqual(mockRoutingPathData)
    );

    expect(result.current.routeNotFounded).toBe(false);
  });
});
