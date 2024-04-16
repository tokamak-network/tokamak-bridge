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
import { transactionModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import useTxConfirmModal from "../modal/useTxConfirmModal";
import { accountDrawerStatus } from "@/recoil/modal/atom";

export default function useCallBridgeSwapAction() {
  const { isConnected, address } = useAccount();
  const { connectToWallet } = useConnectWallet();
  const { inToken, outToken } = useInOutTokens();
  const { mode } = useGetMode();
  const { inNetwork, outNetwork } = useInOutNetwork();

  const { write: _depositETH, isError } = useCallDeposit("depositETH");
  const { write: _depositERC20, isError: _depositERC20Error } =
    useCallDeposit("depositERC20");
  const { write: _withdraw, isError: _withdrawError } =
    useCallWithdraw("withdraw");

  const { callTokenSwap, isError: _swapError } = useAmountOut();
  const { wrapTON, unwrapWTON, wrapETH, unwrapWETH } = useWrap();

  // const [, setModalOpen] = useRecoilState(transactionModalStatus);
  const { setModalOpen, setIsOpen } = useTxConfirmModal();

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
              gas: BigInt("1425420"),
            });
          }

          return _depositERC20({
            args: [
              inToken.address[inNetwork.chainName],
              outTokenAddress,
              parsedAmount,
              200000,
              "0x",
            ],
          });
        case "Withdraw":
          if (isETH) {
            return _withdraw({
              args: [predeploys.OVM_ETH, parsedAmount, 1_300_000, "0x"],
            });
          }

          return _withdraw({
            args: [inToken.address[inNetwork.chainName], parsedAmount, 0, "0x"],
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
  }, [isConnected, connectToWallet, mode, inToken, address]);

  useEffect(() => {
    if (isError || _depositERC20Error || _withdrawError || _swapError) {
      setModalOpen("error");
    }
  }, [isError, _depositERC20Error, _withdrawError, _swapError]);

  return { onClick };
}
