// import { getContract } from "viem";

import { useEffect } from "react";
import { getContract, getWalletClient } from "@wagmi/core";

import TON from "@/abis/TON.json";
import WTON from "@/abis/WTON.json";
import TOS from "@/abis/TOS.json";
import {
  MAINNET_CONTRACTS,
  GOERLI_CONTRACTS,
  TOKAMAK_CONTRACTS,
  TOKAMAK_GOERLI_CONTRACTS,
} from "@/constant/contracts";

function useTokenContract() {
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

  const Token_Contracts = { TON_CONTRACT, WTON_CONTRACT, TOS_CONTRACT };

  return { Token_Contracts };
}

export function useCallContract() {
  const { Token_Contracts } = useTokenContract();

  return { Token_Contracts };
}
