"use client";

import { ChakraProvidersForNextJs } from "@/app/providers/chakraProvider";
import { WagmiProviders } from "@/app/providers/wagmiProvider";

import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";

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
          <WagmiProviders>{children}</WagmiProviders>
        </ChakraProvidersForNextJs>
      </body>
    </html>
  );
}
