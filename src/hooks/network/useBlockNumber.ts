import { useEffect, useMemo, useState } from "react";
import { useBlockNumber } from "wagmi";
import useConnectedNetwork from ".";

export default function useBlockNum() {
  const { data: _blockNumber } = useBlockNumber({
    watch: true,
    cacheTime: 10000,
  });
  const { layer } = useConnectedNetwork();

  const [blockNumber, setBlockNumber] = useState<bigint | undefined>(undefined);

  useEffect(() => {
    if (layer === "L2" && blockNumber) {
      setTimeout(() => {
        setBlockNumber(_blockNumber);
      }, 5000);
      return;
    }
    return setBlockNumber(_blockNumber);
  }, [layer, _blockNumber]);

  return { blockNumber };
}
