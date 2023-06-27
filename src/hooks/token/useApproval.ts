import { useRecoilValue } from "recoil";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useProvier } from "@/hooks/provider/useProvider";
import { ethers, Contract } from "ethers";
import ERC20_ABI from "@/constant/abis/erc20.json";
import TON_ABI from "@/constant/abis/TON.json";
import {
  useAccount,
  useBlockNumber,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetMode } from "../mode/useGetMode";
import useContract from "@/hooks/contracts/useContract";
import { useErc20Approve, usePrepareErc20Approve } from "@/generated";
import useConnectedNetwork from "../network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { useTx } from "../tx/useTx";

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
        swapRouter: boolean;
        pool: boolean;
        swapper: boolean;
      }
    | undefined
  >(undefined);

  const { inToken } = useInOutTokens();
  const { provider } = useProvier();
  const { address } = useAccount();
  const { connectedChainId } = useConnectedNetwork();
  const {
    L1BRIDGE_CONTRACT,
    L2BRIDGE_CONTRACT,
    UNISWAP_CONTRACT,
    SWAPPER_V2_CONTRACT,
  } = useContract();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  useEffect(() => {
    const fetchAllowance = async () => {
      if (inToken && inToken.tokenAddress !== null && address) {
        if (
          inToken.isNativeCurrency?.includes(
            SupportedChainId.MAINNET || SupportedChainId.GOERLI
          )
        ) {
          return setApproved({
            l1birdge: true,
            swapRouter: true,
            pool: true,
            swapper: true,
          });
        }

        const tokenAddress = inToken.tokenAddress;
        const tokenAmount = inToken.amountBN ?? 0.01;
        const TOKEN_CONTRACT = new ethers.Contract(
          tokenAddress,
          ERC20_ABI.abi,
          provider
        );
        const allowances = await Promise.all([
          getAllowance(TOKEN_CONTRACT, address, L1BRIDGE_CONTRACT),
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
          getAllowance(TOKEN_CONTRACT, address, SWAPPER_V2_CONTRACT),
        ]);

        const result = allowances.map((e) => {
          return e.toBigInt() >= tokenAmount;
        });

        return setApproved({
          l1birdge: result[0],
          swapRouter: result[1],
          pool: result[2],
          swapper: result[3],
        });
      }
    };
    fetchAllowance().catch((e) => {
      console.log("**fetchAllowance err**");
      console.log(e);
    });
  }, [
    inToken?.tokenAddress,
    inToken?.amountBN,
    blockNumber,
    UNISWAP_CONTRACT,
    connectedChainId,
  ]);

  // const callApprove = useCallback(() => {}, [approved]);

  return { approved };
}

export function useCallApprove() {}

export function usePermit() {}

export function useApprove() {
  const { mode } = useGetMode();
  const { approved } = useAllowance();
  const { inToken } = useInOutTokens();

  const isApproved = useMemo(() => {
    if (approved) {
      switch (mode) {
        case "Deposit":
          return approved?.l1birdge;
        case "Withdraw":
          return true;
        case "Swap":
          return approved?.swapRouter;
        case "Wrap":
        case "Unwrap":
          return approved?.swapper;
        default:
          return;
      }
    }
  }, [mode, approved]);

  const { write, data } = useContractWrite({
    address: inToken?.tokenAddress as `0x${string}`,
    abi: TON_ABI.abi,
    functionName: "approve",
  });
  const { data: totalSupply } = useContractRead({
    address: inToken?.tokenAddress as `0x${string}`,
    abi: TON_ABI.abi,
    functionName: "totalSupply",
  });

  const tx = useTx({
    hash: data?.hash,
    txSort: "Approve",
    tokenAddress: inToken?.tokenAddress as `0x${string}`,
  });

  const {
    L1BRIDGE_CONTRACT,
    L2BRIDGE_CONTRACT,
    UNISWAP_CONTRACT,
    SWAPPER_V2_CONTRACT,
  } = useContract();

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
          case "Wrap":
          case "Unwrap":
            return write({
              args: [SWAPPER_V2_CONTRACT, totalSupply],
            });
          default:
            break;
        }
      }
    } catch (e) {
      console.log("**callApprove err*");
      console.log(e);
    }
  }, [mode, totalSupply]);

  return { isApproved, callApprove };
}
