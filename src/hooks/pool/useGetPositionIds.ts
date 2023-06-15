import { ethers } from "ethers";
import NONFUNGIBLE_POSITION_MANAGER_ABI from "@/abis/NONFUNGIBLE_POSITION_MANAGER_ABI.json";
import { useProvier } from "../provider/useProvider";
import useContract from "../contracts/useContract";
import { useCallback } from "react";
export default function useGetPositionIds(): Promise<number[]> {
  const { provider } = useProvier();
  const { UNISWAP_CONTRACT } = useContract();

  const positionContract = new ethers.Contract(
    UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    NONFUNGIBLE_POSITION_MANAGER_ABI,
    provider
  );

  const getPotionIds = useCallback(() => {}, []);

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
