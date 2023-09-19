import { Contract } from "ethers";

export function encodeMulticall(params: {
  to: string;
  from: string;
  value: string;
  contract: Contract;
  multicallParam: string[];
}) {
  const { contract, multicallParam, to, from, value } = params;
  // Specify the function and parameters you want to call
  const functionName = "multicall"; // The function you want to call on the NFT Position Manager contract
  const functionParams = [multicallParam]; // Add your multicallParam here

  // Encode the function call data
  const functionData = contract.interface.encodeFunctionData(
    functionName,
    functionParams
  );

  return {
    to, // contract address
    data: functionData, // Encoded function call data
    from,
    value,
  };
}
