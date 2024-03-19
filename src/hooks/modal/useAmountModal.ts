import { useRecoilState } from "recoil";
import {
    tokenAmountModalStatus,
} from "@/recoil/bridgeSwap/atom";
import { useInOutNetwork } from "@/hooks/network";
import {
    selectedInTokenStatus,
    selectedOutTokenStatus,
    tokenModalStatus,
  } from "@/recoil/bridgeSwap/atom";
  import { searchTokenStatus, isInputTokenAmount, isOutputTokenAmount } from "@/recoil/card/selectCard/searchToken";


export default function useAmountModal() {
    const [tokenAmountModal, setTokenAmountModal] = useRecoilState(tokenAmountModalStatus)
    const isInAmountOpen = tokenAmountModal?.isOpen === "INPUT";
    const isOutAmountOpen = tokenAmountModal?.isOpen === "OUTPUT";
    const { inNetwork, outNetwork } = useInOutNetwork();
    const isL2 = inNetwork?.layer === "L2" || outNetwork?.layer === "L2";


    const [, setIsInputAmount] = useRecoilState(isInputTokenAmount);
    const [, setIsOutputAmount] = useRecoilState(isOutputTokenAmount);
    const [selectedInToken, setSelectedInToken] = useRecoilState(
        selectedInTokenStatus
    );

    const [selectedOutToken, setSelectedOutToken] = useRecoilState(
        selectedOutTokenStatus
    );

    const onOpenInAmount = () => {
        setTokenAmountModal({ isOpen: "INPUT" });
    };
    const onOpenOutAmount = () => {
        setTokenAmountModal({ isOpen: "OUTPUT" });
    };

    const onCloseAmountModal = () => {
        setTokenAmountModal({ isOpen: null });
        setIsOutputAmount(false);

        if (!selectedInToken?.amountBN) {
            setIsInputAmount(false);
        }
    };

    return {
        onOpenInAmount,
        onOpenOutAmount,
        onCloseAmountModal,
        isInAmountOpen,
        isOutAmountOpen
    };


}