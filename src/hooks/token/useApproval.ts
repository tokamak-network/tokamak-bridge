import { useRecoilValue } from "recoil";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useProvier } from "@/hooks/provider/useProvider";
import { ethers, Contract } from "ethers";
import ERC20_ABI from "@/constant/abis/erc20.json";
import USDT_ABI from "@/constant/abis/USDT.json";

import {
  useAccount,
  useBlockNumber,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetMode } from "../mode/useGetMode";
import useContract from "@/hooks/contracts/useContract";
import {
  useErc20Allowance,
  useErc20Approve,
  usePrepareErc20Approve,
} from "@/generated";
import useConnectedNetwork from "../network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { useTx } from "../tx/useTx";
import useBlockNum from "../network/useBlockNumber";
import {
  GOERLI_CONTRACTS,
  MAINNET_CONTRACTS,
  TOKAMAK_CONTRACTS,
  TOKAMAK_GOERLI_CONTRACTS,
} from "@/constant/contracts";
import { getWETHAddress } from "@/utils/token/isETH";
import { useAllowance } from "../pool/useApproveToken";
import { Hash } from "viem";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";

const getAllowance = async (
  ERC20_contract: Contract,
  account: string,
  contractAddress: string
) => {
  const allowance = await ERC20_contract.allowance(account, contractAddress);
  return allowance;
};

// export function useAllowance() {
//   const [approved, setApproved] = useState<
//     | {
//         l1birdge: boolean;
//         swapRouter: boolean;
//         pool: boolean;
//         swapper: boolean;
//         WETH: boolean;
//       }
//     | undefined
//   >(undefined);

//   const { inToken } = useInOutTokens();
//   const { provider } = useProvier();
//   const { address } = useAccount();
//   const { connectedChainId, chainName } = useConnectedNetwork();
//   const {
//     L1BRIDGE_CONTRACT,
//     L2BRIDGE_CONTRACT,
//     UNISWAP_CONTRACT,
//     SWAPPER_V2_CONTRACT,
//   } = useContract();
//   const { data: blockNumber } = useBlockNumber({ watch: true });

//   useEffect(() => {
//     const fetchAllowance = async () => {
//       if (
//         inToken &&
//         inToken.tokenAddress !== null &&
//         address &&
//         provider &&
//         chainName
//       ) {
//         if (
//           inToken.isNativeCurrency?.includes(
//             SupportedChainId.MAINNET || SupportedChainId.GOERLI
//           )
//         ) {
//           return setApproved({
//             l1birdge: true,
//             swapRouter: true,
//             pool: true,
//             swapper: true,
//             WETH: true,
//           });
//         }

//         const tokenAddress = inToken.tokenAddress;
//         const tokenAmount = inToken.amountBN ?? 0.01;
//         const TOKEN_CONTRACT = new ethers.Contract(
//           tokenAddress,
//           ERC20_ABI.abi,
//           provider
//         );
//         const allowances = await Promise.all([
//           getAllowance(TOKEN_CONTRACT, address, L1BRIDGE_CONTRACT),
//           getAllowance(
//             TOKEN_CONTRACT,
//             address,
//             UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2
//           ),
//           getAllowance(
//             TOKEN_CONTRACT,
//             address,
//             UNISWAP_CONTRACT.POOL_FACTORY_CONTRACT_ADDRESS
//           ),
//           getAllowance(TOKEN_CONTRACT, address, SWAPPER_V2_CONTRACT),
//           // getAllowance(TOKEN_CONTRACT, address, getWETHAddress(chainName)),
//         ]);

//         const result = allowances.map((e) => {
//           return e.toBigInt() >= tokenAmount;
//         });

//         return setApproved({
//           l1birdge: result[0],
//           swapRouter: result[1],
//           pool: result[2],
//           swapper: result[3],
//           WETH: result[4],
//         });
//       }
//     };
//     fetchAllowance().catch((e) => {
//       console.log("**fetchAllowance err**");
//       console.log(e);
//     });
//   }, [
//     inToken?.tokenAddress,
//     inToken?.amountBN,
//     blockNumber,
//     UNISWAP_CONTRACT,
//     connectedChainId,
//     provider,
//     L1BRIDGE_CONTRACT,
//     chainName,
//   ]);

//   // const callApprove = useCallback(() => {}, [approved]);

//   return { approved };
// }

export function useApprove() {
  const { mode } = useGetMode();
  const { inToken } = useInOutTokens();
  const { blockNumber } = useBlockNum();

  const { L1BRIDGE_CONTRACT, L2BRIDGE_CONTRACT, SWAPPER_V2_CONTRACT } =
    useContract();
  const { UNISWAP_CONTRACT } = useUniswapContracts();

  const { isApproved: approved } = useAllowance({
    inputTokenAmount: inToken?.amountBN,
    tokenAddress: inToken?.token.address as Hash | undefined,
    token: inToken,
    contractAddress:
      mode === "Deposit"
        ? (L1BRIDGE_CONTRACT as Hash)
        : mode === "Swap"
        ? (UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2 as Hash)
        : mode === "Wrap" || mode === "Unwrap"
        ? (SWAPPER_V2_CONTRACT as Hash)
        : undefined,
  });

  const isApproved = useMemo(() => {
    switch (mode) {
      case "Deposit":
        return approved;
      case "Withdraw":
        return true;
      case "Swap":
        return approved;
      case "Wrap":
      case "Unwrap":
        return approved;
      case "ETH-Wrap":
      case "ETH-Unwrap":
        return true;
      default:
        return false;
    }
  }, [mode, approved, blockNumber]);

  const isUSDT =
    inToken?.tokenAddress === MAINNET_CONTRACTS.USDT_ADDRESS ||
    inToken?.tokenAddress === GOERLI_CONTRACTS.USDT_ADDRESS ||
    inToken?.tokenAddress === TOKAMAK_CONTRACTS.USDT_ADDRES ||
    inToken?.tokenAddress === TOKAMAK_GOERLI_CONTRACTS.USDT_ADDRES;

  const { write, data } = useContractWrite({
    address: inToken?.tokenAddress as `0x${string}`,
    //@ts-ignore
    abi: isUSDT ? USDT_ABI : ERC20_ABI.abi,
    functionName: "approve",
  });
  const { data: totalSupply } = useContractRead({
    address: inToken?.tokenAddress as `0x${string}`,
    abi: ERC20_ABI.abi,
    functionName: "totalSupply",
  });

  const tx = useTx({
    hash: data?.hash,
    txSort: "Approve",
    tokenAddress: inToken?.tokenAddress as `0x${string}`,
  });
  const { chainName } = useConnectedNetwork();

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
              args: [UNISWAP_CONTRACT.SWAP_ROUTER_ADDRESS2, totalSupply],
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
  }, [mode, totalSupply, chainName]);

  return { isApproved, callApprove };
}
