import { useEffect, useMemo, useState } from "react";
import { useBlockNumber } from "wagmi";
import useConnectedNetwork from ".";
import { useProvier } from "../provider/useProvider";

export default function useBlockNum() {
  const { layer } = useConnectedNetwork();
  /**
   * Wagmi Provider has a issue to track block number and state changes on L2
   */
  // const { data: blockNumber } = useBlockNumber({
  //   watch: true,
  //   cacheTime: 20000,
  // });
  const [blockNumber, setBlockNumber] = useState<bigint | undefined>(undefined);

  const { provider } = useProvier();

  useEffect(() => {
    if (provider) {
      const onBlock = (blockNumber: number) => {
        setBlockNumber(BigInt(blockNumber));
      };
      provider.on("block", onBlock);

      return () => {
        // Clean up the event listener when the component unmounts
        provider.off("block", onBlock);
      };
    }
  }, [provider]);

  return { blockNumber };
}
