"use client";

import { Account } from "../components/Account";
import { Connect } from "../components/Connect";
import { Connected } from "../components/Connected";
import { ERC20 } from "../components/ERC20";
import { NetworkSwitcher } from "../components/NetworkSwitcher";
import BridgeSwap from "./BridgeSwap/Index";

export function Page() {
  return (
    <>
      <BridgeSwap />
    </>
    // <>
    //   <h1>wagmi + Next.js + @wagmi/cli (ERC20)</h1>
    //   <Connect />

    //   <Connected>
    //     <Account />
    //     <hr />
    //     <ERC20 />
    //     <hr />
    //     <NetworkSwitcher />
    //   </Connected>
    // </>
  );
}

export default Page;
