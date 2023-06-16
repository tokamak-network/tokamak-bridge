import { ethers } from "ethers";
import NONFUNGIBLE_POSITION_MANAGER_ABI from "@/abis/NONFUNGIBLE_POSITION_MANAGER_ABI.json";
import { useProvier } from "../provider/useProvider";
import useContract from "../contracts/useContract";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useBlockNum from "../network/useBlockNumber";
export default function useGetPositionIds() {
  const { provider } = useProvier();
  const { UNISWAP_CONTRACT } = useContract();

  const { address } = useAccount();
  const { blockNumber } = useBlockNum();

  const [positionIds, setPositionIds] = useState<number[] | undefined>(
    undefined
  );

  const callPositionIds = useCallback(async () => {
    console.log("go");
    if (address) {
      const positionContract = new ethers.Contract(
        UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER,
        NONFUNGIBLE_POSITION_MANAGER_ABI,
        provider
      );

      // Get number of positions
      const balance: number = await positionContract.balanceOf(address);

      // Get all positions
      const tokenIds = [];
      for (let i = 0; i < balance; i++) {
        const tokenOfOwnerByIndex: number =
          await positionContract.tokenOfOwnerByIndex(address, i);
        tokenIds.push(tokenOfOwnerByIndex);
      }
      return tokenIds;
    }
    return undefined;
  }, [UNISWAP_CONTRACT, address]);

  useEffect(() => {
    const fetchPositionIds = async () => {
      const result = await callPositionIds();
      return setPositionIds(result);
    };
    fetchPositionIds();
  }, [blockNumber]);

  return { positionIds };
}
