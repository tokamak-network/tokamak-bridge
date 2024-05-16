import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProviders } from "@/providers/wagmiProvider";
import { renderHook, waitFor } from "@testing-library/react";
import { RecoilRoot } from "recoil";
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

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <RecoilRoot>
    <WagmiProviders>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProviders>
  </RecoilRoot>
);

vi.mock("wagmi", async (importOriginal) => {
  const actual = await importOriginal<typeof import("wagmi")>(); // wagmi 모듈의 원본 구현 불러오기
  return {
    ...actual, // 모든 원본 구현 유지
    useAccount: () => ({
      address: "0x8091C2fD8a79a9EF812d487052496243f6825B02", // 모킹하고자 하는 주소
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
  useGetMode: () => ({ mode: "Swap" }), // useGetMode 훅 모킹
}));

beforeEach(() => {
  // 각 테스트 전에 모든 모킹 초기화
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
      wrapper: Wrapper,
    });

    await waitFor(() =>
      expect(result.current.routingPath).toEqual(mockRoutingPathData)
    );

    expect(result.current.routeNotFounded).toBe(false);
  });
});
