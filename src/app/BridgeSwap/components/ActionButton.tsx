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
import { bannerStatus } from "@/recoil/bridgeSwap/atom";
import { useInOutNetwork } from "@/hooks/network";
import { isETH } from "@/utils/token/isETH";

export default function ActionButton() {
  const { isConnected } = useAccount();
  const { mode, isReady } = useRecoilValue(actionMode);
  const { isApproved } = useApprove();
  const { isNotSupportForSwap } = useBridgeSupport();
  const [isLoading] = useIsLoading();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { isBalanceOver, isInputZero } = useInputBalanceCheck();
  const { isPending } = useTransaction();
  const { outToken, outTokenInfo } = useInOutTokens();
  const { isTONatPair } = useIsTon();
  const status = useRecoilValue(bannerStatus);
  const { inNetwork, outNetwork } = useInOutNetwork();

  const needToOpenModal =
    mode === "Deposit" || mode === "Withdraw" || mode === "Swap";

  const isL2 = inNetwork?.layer === "L2" || outNetwork?.layer === "L2";
  const deactivateButton = status === "Active" && isL2;
  const outTokenIsETH = isETH(outTokenInfo);

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
        (mode === "Swap" && isTONatPair) ||
        deactivateButton;
      // ||
      // (mode === "Swap" && outTokenIsETH !== undefined && outTokenIsETH);
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

  return (
    <Button
      w={"100%"}
      h={"48px"}
      fontSize={16}
      fontWeight={600}
      _active={{}}
      _hover={{}}
      _disabled={{}}
      bgColor={isDisabled ? "#17181D" : "#007AFF"}
      color={isDisabled ? "#8E8E92" : "#fff"}
      isDisabled={!isConnected ? false : isDisabled}
      onClick={
        isConnected === false
          ? () => connetAndDisconntWallet()
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
        : mode}{" "}
      <span style={{ fontSize: "10px", marginLeft: "3px", marginTop: "3px" }}>
        {deactivateButton ? "(Service under maintenance)" : ""}
        {/* {'(Service under maintenance)'} */}
      </span>
    </Button>
  );
}
