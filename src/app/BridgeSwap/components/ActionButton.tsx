import { useCallback, useEffect, useMemo, useState } from "react";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { Button } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useAccount } from "wagmi";
import { useApprove } from "@/hooks/token/useApproval";
import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import useConfirmModal from "@/hooks/modal/useConfirmModal";
import useCallBridgeSwapAction from "@/hooks/contracts/useCallBridgeSwapActions";
import useIsLoading from "@/hooks/ui/useIsLoading";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useIsTon from "@/hooks/token/useIsTon";
import { bannerStatus } from "@/recoil/bridgeSwap/atom";
import { useInOutNetwork } from "@/hooks/network";
import "@fontsource/poppins/600.css";
import { txPendingStatus } from "@/recoil/global/transaction";
import { Action, Status } from "@/staging/types/transaction";

import { useHandleConfirm } from "@/staging/components/new-confirm/hooks/useDepositWithdrawHandleConfirm";
import useSwapConfirmModal from "@/staging/components/new-confirm/hooks/useSwapConfirmModal";

// FW UI test @Robert
import useCTOptionModal from "@/staging/components/cross-trade/hooks/useCTOptionModal";

export default function ActionButton() {
  const { isConnected } = useAccount();
  const { mode, isReady } = useRecoilValue(actionMode);
  const { isApproved } = useApprove();
  const { isNotSupportForSwap } = useBridgeSupport();
  const [isLoading] = useIsLoading();

  // const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { isBalanceOver, isInputZero } = useInputBalanceCheck();
  const txPending = useRecoilValue(txPendingStatus);
  const { outToken, inToken } = useInOutTokens();
  const { isTONatPair } = useIsTon();
  const status = useRecoilValue(bannerStatus);
  const { inNetwork, outNetwork } = useInOutNetwork();

  const needToOpenWithdrawModal = mode === "Withdraw";
  const needToOpenDepositModal = mode === "Deposit";
  const needToOpenSwapModal = mode === "Swap";
  const isL2 = inNetwork?.layer === "L2" || outNetwork?.layer === "L2"; //checks if the action is L2
  const deactivateButton = status === "Active" && isL2; //when the maintenance banner is active, this will disable the action button related to all L2 actions

  const isDisabled = useMemo(() => {
    if ((mode === "Withdraw" || !isConnected) && !isInputZero) return false;
    if ((mode === "Deposit" || !isConnected) && isInputZero) return true;
    const disabled =
      !isReady ||
      (mode === "Swap" && isLoading) ||
      isNotSupportForSwap ||
      isBalanceOver ||
      txPending ||
      (mode === "Swap" && outToken === null) ||
      isInputZero ||
      (mode === "Swap" && isTONatPair) ||
      deactivateButton;
    return disabled;
  }, [
    isReady,
    isApproved,
    isLoading,
    isNotSupportForSwap,
    isBalanceOver,
    txPending,
    isTONatPair,
    isInputZero,
    mode,
    outToken,
    isConnected,
  ]);

  const { onClick } = useCallBridgeSwapAction();
  const { connetAndDisconntWallet } = useConnectWallet();
  const { onOpenCTOptionModal } = useCTOptionModal();
  const handleConfirm = useHandleConfirm();
  const { onOpenSwapConfirmModal } = useSwapConfirmModal();

  const buttonAction = useCallback(() => {
    if (!isConnected) return connetAndDisconntWallet();
    if (needToOpenWithdrawModal) return onOpenCTOptionModal();
    if (needToOpenDepositModal)
      return handleConfirm(Action.Deposit, Status.Initiate);
    if (needToOpenSwapModal) return onOpenSwapConfirmModal();
    return onClick();
  }, [
    isConnected,
    needToOpenWithdrawModal,
    needToOpenDepositModal,
    needToOpenSwapModal,
    inToken,
    outToken,
    inNetwork,
    outNetwork
  ]);

  return (
    <>
      {/** FW UI test End @Robert*/}
      <Button
        w={"100%"}
        h={"48px"}
        fontSize={16}
        fontWeight={600}
        _active={{}}
        _hover={{}}
        _disabled={{}}
        bgColor={!isConnected ? "#007AFF" : isDisabled ? "#17181D" : "#007AFF"}
        color={!isConnected ? "fff" : isDisabled ? "#8E8E92" : "#fff"}
        isDisabled={isDisabled}
        onClick={buttonAction}
        cursor={"pointer !important"}
      >
        {!isConnected && "Connect Wallet"}
        {!isConnected
          ? null
          : isConnected && mode === null
            ? "Select Network"
            : mode === "Withdraw"
              ? "Next"
              : isBalanceOver
                ? "Insufficient balance"
                : mode?.replaceAll("ETH-", "")}{" "}
        <span style={{ fontSize: "10px", marginLeft: "3px", marginTop: "3px" }}>
          {deactivateButton ? "(Service under maintenance)" : ""}
          {/* {'(Service under maintenance)'} */}
        </span>
      </Button>
    </>
  );
}
