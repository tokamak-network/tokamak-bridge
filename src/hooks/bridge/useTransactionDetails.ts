import { useMemo } from "react";
import useCallDeposit from "./actions/useCallDeposit";
import useCallWithdraw from "./actions/useCallWithdraw";
import { useRecoilValue } from "recoil";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { useTotalGas } from "../contracts/useL2Provider";

export default function useTransactionDetail() {
  const { write: _depositETH, contract: _depositETH_contract } =
    useCallDeposit("depositETH");
  const { write: _depositERC20, contract: _depositERC20_contract } =
    useCallDeposit("depositERC20");
  const { write: _withdraw, contract: _withdraw_contract } =
    useCallWithdraw("withdraw");
  const { mode } = useRecoilValue(actionMode);

  // const { l1GasCost, l2GasCost } = useTotalGas(
  //   mode === "Deposit"
  //     ? _depositETH_contract
  //     : mode === "Withdraw"
  //     ? _withdraw_contract
  //     : null
  // );

  // const { l1GasCost, l2GasCost } = useTotalGas(_withdraw_contract);

  const { l1GasCost, l2GasCost } = useTotalGas(_withdraw_contract);

  console.log("go");
  console.log(mode);
  console.log(l1GasCost, l2GasCost);

  return { l1GasCost, l2GasCost };
}
