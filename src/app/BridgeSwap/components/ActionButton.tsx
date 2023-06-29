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

export default function ActionButton() {
  const { isConnected } = useAccount();
  const { mode, isReady } = useRecoilValue(actionMode);
  const { isApproved } = useApprove();
  const { isNotSupportForSwap } = useBridgeSupport();
  const [isLoading] = useIsLoading();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const needToOpenModal =
    mode === "Deposit" || mode === "Withdraw" || mode === "Swap";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const disabled =
        !isReady || isApproved === false || isLoading || isNotSupportForSwap;
      setIsDisabled(disabled);
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [!isReady || isApproved === false || isLoading || isNotSupportForSwap]);

  const { onOpenConfirmModal } = useConfirmModal();
  const { onClick } = useCallBridgeSwapAction();

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
      isDisabled={isDisabled}
      onClick={needToOpenModal ? onOpenConfirmModal : onClick}
    >
      {!isConnected && "Connect Wallet"}
      {isConnected && mode === null ? "Select Network" : mode}
    </Button>
  );
}
