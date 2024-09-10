import { BigNumber } from "ethers";

export enum MessageDirection {
  L1_TO_L2,
  L2_TO_L1,
}
export interface TokenBridgeMessage {
  direction: MessageDirection;
  from: string;
  to: string;
  l1Token: string;
  l2Token: string;
  amount: BigNumber;
  data: string;
  logIndex: number;
  blockNumber: number;
  transactionHash: string;
}
