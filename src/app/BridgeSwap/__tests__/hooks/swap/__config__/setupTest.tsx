import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProviders } from "@/providers/wagmiProvider";
import { RecoilRoot } from "recoil";

const queryClient = new QueryClient();

export const setupTestWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <RecoilRoot>
    <WagmiProviders>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProviders>
  </RecoilRoot>
);
