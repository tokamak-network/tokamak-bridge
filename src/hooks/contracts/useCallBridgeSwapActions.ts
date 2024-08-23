import { useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import useConnectWallet from "../account/useConnectWallet";
import { useInOutTokens } from "../token/useInOutTokens";
import { useGetMode } from "../mode/useGetMode";
import { useInOutNetwork } from "../network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { supportedTokens } from "@/types/token/supportedToken";
import useCallDeposit from "../bridge/actions/useCallDeposit";
import useCallWithdraw from "../bridge/actions/useCallWithdraw";
import { useAmountOut } from "../swap/useSwapTokens";
import useWrap from "../swap/useTonWrap";
import { predeploys } from "@eth-optimism/contracts";
import useTxConfirmModal from "../modal/useTxConfirmModal";
import { useGasFee } from "./fee/getGasFee";
import { Hash } from "viem";
import { calculateGasMargin } from "@/utils/txn/calculateGasMargin";
import { BigNumber } from "ethers";
import { isThanosSepolia } from "@/utils/network/checkNetwork";
import { isTON } from "@/utils/token/checkToken";

export default function useCallBridgeSwapAction() {
  const { isConnected, address } = useAccount();
  const { connectToWallet } = useConnectWallet();
  const { inToken } = useInOutTokens();
  const { mode } = useGetMode();
  const { inNetwork, outNetwork } = useInOutNetwork();
  const {
    write: _depositETH,
    contract: _depositETH_contract,
    isError,
  } = useCallDeposit("depositETH");
  const { write: _depositERC20, isError: _depositERC20Error } =
    useCallDeposit("depositERC20");
  const { write: _depositNativeToken_contract } =
    useCallDeposit("depositNativeToken");
  const {
    write: _withdraw,
    isError: _withdrawError,
    contract: _withdrawContract,
  } = useCallWithdraw("withdraw");
  const { callTokenSwap } = useAmountOut();
  const { wrapTON, unwrapWTON, wrapETH, unwrapWETH } = useWrap();
  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const { gasLimit } = useGasFee();

  const onClick = useCallback(async () => {
    if (!isConnected) {
      return connectToWallet();
    }
    if (inToken && inToken.amountBN && inNetwork && outNetwork) {
      const isETH = inToken.isNativeCurrency?.includes(
        SupportedChainId.MAINNET
      );
      const parsedAmount = inToken.amountBN;
      if (
        mode === "Wrap" ||
        mode === "Unwrap" ||
        mode === "ETH-Wrap" ||
        mode === "ETH-Unwrap"
      ) {
      } else {
        setIsOpen(true);
        setModalOpen("confirming");
      }

      switch (mode) {
        case "Deposit":
          const supportedOutToken = supportedTokens.filter(
            (token) => token.address === inToken.address
          )[0];
          const outTokenAddress =
            supportedOutToken.address[outNetwork.chainName];

          if (isETH) {
            return _depositETH({
              args: [200000, "0x"],
              //need to put gasAmount with gasOrcale later
              value: parsedAmount as bigint,
              gas: gasLimit,
            });
          }
          // deposit TON to Thanos
          if (isThanosSepolia(outNetwork) && isTON(inToken)) {
            return _depositNativeToken_contract({
              //@ts-ignore
              args: [parsedAmount as bigint, 200000, "0x"],
            });
          }
          console.log(
            inToken.address[inNetwork.chainName],
            outTokenAddress,
            parsedAmount
          );
          return _depositERC20({
            args: [
              inToken.address[inNetwork.chainName],
              outTokenAddress,
              parsedAmount,
              200000,
              "0x",
            ],
            // gas: gasLimit,
          });
        case "Withdraw":
          if (isETH) {
            const txData = [predeploys.OVM_ETH, parsedAmount, 1_300_000, "0x"];
            const gasLimitForL2 = await _withdrawContract.estimateGas.withdraw({
              //@ts-ignore
              account: address as Hash,
              args: txData,
            });
            return _withdraw({
              args: txData,
              gas: calculateGasMargin(BigNumber.from(gasLimitForL2)).toBigInt(),
            });
          }
          const txData = [
            inToken.address[inNetwork.chainName],
            parsedAmount,
            0,
            "0x",
          ];
          const gasLimitForL2 = await _withdrawContract.estimateGas.withdraw({
            //@ts-ignore
            account: address as Hash,
            args: txData,
          });
          return _withdraw({
            args: txData,
            gas: calculateGasMargin(BigNumber.from(gasLimitForL2)).toBigInt(),
          });
        case "Swap":
          return callTokenSwap();
        case "Wrap":
          return wrapTON();
        case "Unwrap":
          return unwrapWTON();
        case "ETH-Wrap":
          return wrapETH();
        case "ETH-Unwrap":
          return unwrapWETH();
        default:
          return console.error("action mode is not found");
      }
    }
  }, [isConnected, connectToWallet, mode, inToken, address, gasLimit]);

  useEffect(() => {
    if (isError || _depositERC20Error || _withdrawError) {
      setModalOpen("error");
    }
  }, [isError, _depositERC20Error, _withdrawError]);

  return { onClick };
}
