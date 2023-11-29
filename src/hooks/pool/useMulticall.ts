import { BigNumber, Contract } from "ethers";
import { useMemo } from "react";

type MethodArg = string | number | BigNumber;
type MethodArgs = Array<MethodArg | MethodArg[]>;
type OptionalMethodInputs =
  | Array<MethodArg | MethodArg[] | undefined>
  | undefined;

interface ListenerOptions {
  // how often this data should be fetched, by default 1
  readonly blocksPerFetch: number;
}
interface ListenerOptionsWithGas extends ListenerOptions {
  readonly gasRequired?: number;
}
interface Call {
  address: string;
  callData: string;
  gasRequired?: number;
}
interface CallStateResult extends ReadonlyArray<any> {
  readonly [key: string]: any;
}
interface CallState {
  readonly valid: boolean;
  // the result, or undefined if loading or errored/no data
  readonly result: CallStateResult | undefined;
  // true if the result has never been fetched
  readonly loading: boolean;
  // true if the result is not for the latest block
  readonly syncing: boolean;
  // true if the call was made and is synced, but the return data is invalid
  readonly error: boolean;
}

function isMethodArg(x: unknown): x is MethodArg {
  return (
    BigNumber.isBigNumber(x) || ["string", "number"].indexOf(typeof x) !== -1
  );
}

function isValidMethodArgs(x: unknown): x is MethodArgs | undefined {
  return (
    x === undefined ||
    (Array.isArray(x) &&
      x.every(
        (xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))
      ))
  );
}

// formats many calls to a single function on a single contract, with the function name and inputs specified
export function useSingleContractMultipleData(
  //   chainId: number | undefined,
  //   latestBlockNumber: number | undefined,
  contract: Contract | null | undefined,
  methodName: string,
  callInputs: OptionalMethodInputs[],
  options?: Partial<ListenerOptionsWithGas>
) {
  // : CallState[]
  const { gasRequired } = options ?? {};

  // Create ethers function fragment
  const fragment = useMemo(
    () => contract?.interface?.getFunction(methodName),
    [contract, methodName]
  );

  // Get encoded call data. Note can't use useCallData below b.c. this is  for a list of CallInputs
  const callDatas = useMemo(() => {
    if (!contract || !fragment) return [];
    return callInputs.map<string | undefined>((callInput) =>
      isValidMethodArgs(callInput)
        ? contract.interface.encodeFunctionData(fragment, callInput)
        : undefined
    );
  }, [callInputs, contract, fragment]);

  // Create call objects
  const calls = useMemo(() => {
    if (!contract) return [];
    return callDatas.map<Call | undefined>((callData) => {
      if (!callData) return undefined;
      return {
        address: contract.address,
        callData,
        gasRequired,
      };
    });
  }, [contract, callDatas, gasRequired]);

  return { calls };
}
