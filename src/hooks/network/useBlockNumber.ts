import { useEffect, useMemo, useState } from "react";
import { useBlockNumber } from "wagmi";
import useConnectedNetwork from ".";

export default function useBlockNum() {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { layer } = useConnectedNetwork();

  const [blockNum, setBlockNum] = useState<bigint | undefined>(undefined);
  useEffect(() => {
    if (layer === "L2" && blockNumber) {
      setTimeout(() => {
        setBlockNum(blockNumber);
      }, 15000);
    } else {
      setBlockNum(blockNumber);
    }
  }, [layer, blockNumber]);

  return { blockNumber: blockNum };
}
