import { useEffect, useState } from "react";
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
import { useTransaction } from "@/hooks/tx/useTx";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useIsTon from "@/hooks/token/useIsTon";
import { confirmWithdrawStats } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { bannerStatus } from "@/recoil/bridgeSwap/atom";
import { useInOutNetwork } from "@/hooks/network";
import "@fontsource/poppins/600.css";
import { txPendingStatus } from "@/recoil/global/transaction";

export default function ActionButton() {
  const { isConnected } = useAccount();
  const { mode, isReady } = useRecoilValue(actionMode);
  const { isApproved } = useApprove();
  const { isNotSupportForSwap } = useBridgeSupport();
  const [isLoading] = useIsLoading();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { isBalanceOver, isInputZero } = useInputBalanceCheck();
  const txPending = useRecoilValue(txPendingStatus);
  const { outToken, outTokenInfo } = useInOutTokens();
  const { isTONatPair } = useIsTon();
  const status = useRecoilValue(bannerStatus);
  const { inNetwork, outNetwork } = useInOutNetwork();

  const needToOpenModal = mode === "Deposit" || mode === "Swap";
  const needToOpenWithdrawModal = mode === "Withdraw";

  const isL2 = inNetwork?.layer === "L2" || outNetwork?.layer === "L2"; //checks if the action is L2

  const deactivateButton = status === "Active" && isL2; //when the maintenance banner is active, this will disable the action button related to all L2 actions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const disabled =
        !isReady ||
        isApproved === false ||
        (mode === "Swap" && isLoading) ||
        isNotSupportForSwap ||
        isBalanceOver ||
        txPending ||
        (mode === "Swap" && outToken === null) ||
        isInputZero ||
        (mode === "Swap" && isTONatPair) ||
        deactivateButton;
      setIsDisabled(disabled);
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
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
  ]);

  const { onOpenConfirmModal } = useConfirmModal();
  const { onClick } = useCallBridgeSwapAction();
  const { connetAndDisconntWallet } = useConnectWallet();
  const [, setWithdrawStatus] = useRecoilState(confirmWithdrawStats);

  return (
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
      isDisabled={!isConnected ? false : isDisabled}
      onClick={
        isConnected === false
          ? () => connetAndDisconntWallet()
          : needToOpenWithdrawModal
          ? () => setWithdrawStatus({ isOpen: true })
          : needToOpenModal
          ? onOpenConfirmModal
          : onClick
      }
    >
      {!isConnected && "Connect Wallet"}
      {!isConnected
        ? null
        : isConnected && mode === null
        ? "Select Network"
        : mode?.replaceAll("ETH-", "")}{" "}
      <span style={{ fontSize: "10px", marginLeft: "3px", marginTop: "3px" }}>
        {deactivateButton ? "(Service under maintenance)" : ""}
        {/* {'(Service under maintenance)'} */}
      </span>
    </Button>
  );
}
