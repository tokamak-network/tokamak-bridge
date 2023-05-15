// import { getContract } from "viem";

import { useEffect } from "react";
import { getContract, getWalletClient } from "@wagmi/core";

import TON from "@/abis/TON.json";
import WTON from "@/abis/WTON.json";
import TOS from "@/abis/TOS.json";
import contracts from "@/constant/contracts";

export function useCallContract(ERC20_ADDRESS?: `ox${string}`) {
  const {
    MAINNET_CONTRACTS,
    GOERLI_CONTRACTS,
    TOKAMAK_CONTRACTS,
    TOKAMAK_GOERLI_CONTRACTS,
  } = contracts;

  const TON_CONTRACT = getContract({
    address: GOERLI_CONTRACTS.TON_ADDRESS,
    abi: TON.abi,
  });

  const WTON_CONTRACT = getContract({
    address: GOERLI_CONTRACTS.TON_ADDRESS,
    abi: TON.abi,
  });

  const TOS_CONTRACT = getContract({
    address: GOERLI_CONTRACTS.TON_ADDRESS,
    abi: TON.abi,
  });

  return { TON_CONTRACT };
}
