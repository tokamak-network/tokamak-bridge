import { getContractInterface } from "@tokamak-network/titan-contracts";
import { BigNumber, ethers } from "ethers";

export interface CoreCrossChainMessage {
  sender: string;
  target: string;
  message: string;
  messageNonce: BigNumber;
  //value 0으로 설정 가능
  value: BigNumber;
  //gasLimit 0으로 설정 가능
  minGasLimit: BigNumber;
}

export const encodeCrossChainMessage = (
  message: CoreCrossChainMessage,
): string => {
  return getContractInterface("L2CrossDomainMessenger").encodeFunctionData(
    "relayMessage",
    [message.target, message.sender, message.message, message.messageNonce],
  );
};

export const hashCrossChainMessage = (
  message: CoreCrossChainMessage,
): string => {
  return ethers.utils.solidityKeccak256(
    ["bytes"],
    [encodeCrossChainMessage(message)],
  );
};
