import { useEffect, useMemo, useState } from "react";
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
import {
  confirmWithdrawStats,
  confirmWithdrawData,
} from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";

export default function ActionButton() {
  const { isConnected } = useAccount();
  const { mode, isReady } = useRecoilValue(actionMode);
  const { isApproved } = useApprove();
  const { isNotSupportForSwap } = useBridgeSupport();
  const [isLoading] = useIsLoading();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { isBalanceOver, isInputZero } = useInputBalanceCheck();
  const { isPending } = useTransaction();
  const { outToken } = useInOutTokens();
  const { isTONatPair } = useIsTon();

  const needToOpenModal = mode === "Deposit" || mode === "Swap";
  const needToOpenWithdrawModal = mode === "Withdraw";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const disabled =
        !isReady ||
        isApproved === false ||
        (mode === "Swap" && isLoading) ||
        isNotSupportForSwap ||
        isBalanceOver ||
        isPending ||
        (mode === "Swap" && outToken === null) ||
        isInputZero ||
        (mode === "Swap" && isTONatPair);
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
    isPending,
    isTONatPair,
    isInputZero,
    mode,
    outToken,
  ]);

  const { onOpenConfirmModal } = useConfirmModal();
  const { onClick } = useCallBridgeSwapAction();
  const { connetAndDisconntWallet } = useConnectWallet();
  const [withdrawStatus, setWithdrawStatus] = useRecoilState(
    confirmWithdrawStats
  );
  const [withdrawData, setWithdrawData] = useRecoilState(confirmWithdrawData);

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
        : mode}
    </Button>
  );
}
