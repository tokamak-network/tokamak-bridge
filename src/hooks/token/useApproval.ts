import { useRecoilValue } from "recoil";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useProvier } from "@/hooks/provider/useProvider";
import { ethers, Contract } from "ethers";
import ERC20_ABI from "@/constant/abis/erc20.json";
import TON_ABI from "@/constant/abis/TON.json";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetMode } from "../mode/useGetMode";
import useContract from "@/hooks/contracts/useContract";

const getAllowance = async (
  ERC20_contract: Contract,
  account: string,
  contractAddress: string
) => {
  const allowance = await ERC20_contract.allowance(account, contractAddress);
  return allowance;
};

export function useAllowance() {
  const [approved, setApproved] = useState<
    | {
        l1birdge: boolean;
        l2birdge: boolean;
        swapRouter: boolean;
        pool: boolean;
      }
    | undefined
  >(undefined);

  const { inToken } = useInOutTokens();
  const { provider } = useProvier();
  const { address } = useAccount();
  const { L1BRIDGE_CONTRACT, L2BRIDGE_CONTRACT, UNISWAP_CONTRACT } =
    useContract();

  useEffect(() => {
    const fetchAllowance = async () => {
      if (
        inToken &&
        inToken.tokenAddress !== null &&
        inToken.amountBN &&
        address
      ) {
        if (inToken.isNativeCurrency !== null) {
          return setApproved({
            l1birdge: true,
            l2birdge: true,
            swapRouter: true,
            pool: true,
          });
        }

        const tokenAddress = inToken.tokenAddress;
        const tokenAmount = inToken.amountBN ?? 0;
        const TOKEN_CONTRACT = new ethers.Contract(
          tokenAddress,
          ERC20_ABI.abi,
          provider
        );
        const allowances = await Promise.all([
          getAllowance(TOKEN_CONTRACT, address, L1BRIDGE_CONTRACT),
          getAllowance(TOKEN_CONTRACT, address, L2BRIDGE_CONTRACT),
          getAllowance(
            TOKEN_CONTRACT,
            address,
            UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS
          ),
          getAllowance(
            TOKEN_CONTRACT,
            address,
            UNISWAP_CONTRACT.POOL_FACTORY_CONTRACT_ADDRESS
          ),
        ]);

        const result = allowances.map((e) => {
          return e.toBigInt() >= tokenAmount;
        });

        return setApproved({
          l1birdge: result[0],
          l2birdge: result[1],
          swapRouter: result[2],
          pool: result[3],
        });
      }
    };
    fetchAllowance().catch((e) => {
      console.log("**fetchAllowance err**");
      console.log(e);
    });
  }, [inToken?.tokenAddress, inToken?.amountBN]);

  const callApprove = useCallback(() => {}, [approved]);

  return { approved };
}

export function useCallApprove() {}

export function usePermit() {}

export function useApprove() {
  const { mode } = useGetMode();
  const { approved } = useAllowance();
  const { inToken } = useInOutTokens();
  const { provider } = useProvier();

  const isApproved = useMemo(() => {
    if (approved) {
      switch (mode) {
        case "Deposit":
          return approved?.l1birdge;
        case "Withdraw":
          return approved?.l2birdge;
        case "Swap":
          return approved?.swapRouter;
        default:
          return;
      }
    }
  }, [mode, approved]);

  const { write } = useContractWrite({
    address: inToken?.tokenAddress as `0x${string}`,
    abi: TON_ABI.abi,
    functionName: "increaseAllowance",
  });
  const { data: totalSupply } = useContractRead({
    address: inToken?.tokenAddress as `0x${string}`,
    abi: TON_ABI.abi,
    functionName: "totalSupply",
  });
  const { L1BRIDGE_CONTRACT, L2BRIDGE_CONTRACT, UNISWAP_CONTRACT } =
    useContract();

  const callApprove = useCallback(async () => {
    try {
      if (totalSupply) {
        switch (mode) {
          case "Deposit":
            return write({
              args: [L1BRIDGE_CONTRACT, totalSupply],
            });
          case "Withdraw":
            return write({
              args: [L2BRIDGE_CONTRACT, totalSupply],
            });
          case "Swap":
            return write({
              args: [UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS, totalSupply],
            });
          // return TOKEN_CONTRACT.increaseAllowance(
          //     SwapperV2Proxy,
          //     totalSupply
          // );;
          default:
            break;
        }
      }
    } catch (e) {
      console.log("**callApprove err*");
      console.log(e);
    }
  }, [mode]);

  return { isApproved, callApprove };
}
