import { useRecoilState } from "recoil";
import {
    tokenAmountModalStatus,
} from "@/recoil/bridgeSwap/atom";
import { useInOutNetwork } from "@/hooks/network";

export default function useAmountModal() {
    const [tokenAmountModal, setTokenAmountModal] = useRecoilState(tokenAmountModalStatus);
    const isInAmountOpen = tokenAmountModal?.isOpen === "INPUT";
    const isOutAmountOpen = tokenAmountModal?.isOpen === "OUTPUT";
    const { inNetwork, outNetwork } = useInOutNetwork();
    const isL2 = inNetwork?.layer === "L2" || outNetwork?.layer === "L2";

    const onOpenInAmount = () => {
        !(isL2) &&
        setTokenAmountModal({ isOpen: "INPUT" });
    };
    const onOpenOutAmount = () => {
        !(isL2) &&
        setTokenAmountModal({ isOpen: "OUTPUT" });
    };

    const onCloseAmountModal = () => {
        setTokenAmountModal({ isOpen: null });
    
    };

    return {
        onOpenInAmount,
        onOpenOutAmount,
        onCloseAmountModal,
        isInAmountOpen,
        isOutAmountOpen
    };


}