import { useBlockNumber } from "wagmi";

export default function useBlockNum() {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  return { blockNumber };
}
