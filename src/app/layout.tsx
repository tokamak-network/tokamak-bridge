"use client";

import { ChakraProvidersForNextJs } from "@/providers/chakraProvider";
import { WagmiProviders } from "@/providers/wagmiProvider";

import { Center, ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { RecoilRoot } from "recoil";

import Header from "@/components/header/Index";

// export const metadata = {
//   title: "wagmi",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvidersForNextJs>
          <RecoilRoot>
            <WagmiProviders>
              <Header />
              <Center h={"100vh"}>{children}</Center>
            </WagmiProviders>
          </RecoilRoot>
        </ChakraProvidersForNextJs>
      </body>
    </html>
  );
}
