import {
  THANOS_SEPOLIA_CONTRACTS,
  TOKAMAK_CONTRACTS,
} from "@/constant/contracts";
import { providers, utils } from "ethers";
import L1ThanosUSDCBridgeAbi from "@/constant/abis/L1USDCBridge.json";
import L1ThanosBridgeAbi from "@/abis/L1ThanosStandardBridge.json";
import { ethers } from "ethers";
import { ThanosDepositType } from "@/types/tx/txType";

const l1ThanosUSDCBridgeI = new ethers.utils.Interface(L1ThanosUSDCBridgeAbi);
const l1ThanosBridgeI = new ethers.utils.Interface(L1ThanosBridgeAbi);

export const getDecodeThanosLog = (
  logs: providers.Log[]
): {
  l1TokenAddress: string;
  l2TokenAddress: string;
  amount: string;
} => {
  const depositType: ThanosDepositType = (() => {
    switch (logs.length) {
      case 13:
        return "NativeToken";
      case 6:
        return "ERC20";
      case 5:
        return logs[1].topics.length === 4 ? "USDC" : "ETH";
      default:
        return "ERC20";
    }
  })();
  const result =
    depositType === "USDC"
      ? l1ThanosUSDCBridgeI.parseLog(logs[4])
      : l1ThanosBridgeI.parseLog(
          depositType === "NativeToken"
            ? logs[3]
            : depositType === "ETH"
            ? logs[0]
            : logs[1]
        );
  const { args } = result;
  const { l1Token, l2Token, amount } = args;
  return {
    l1TokenAddress: depositType === "ETH" ? "" : l1Token,
    l2TokenAddress:
      depositType === "ETH" ? THANOS_SEPOLIA_CONTRACTS.ETH_ADDRESS : l2Token,
    amount: amount.toString(),
  };
};
