import { atom, selector } from "recoil";
import { Field } from "@/types/swap/swap";
import { TokenInfo, supportedTokens } from "types/token/supportedToken";


type SelectTokenModal = {
    isOpen: Field | null;
    modalData?: any;
};

export type SelectedTokenAmount = TokenInfo & {
    amount: string | null;
};

export const selectedTokenAmountStatus = atom<SelectedTokenAmount | null>({
    key: "selectedTokenAmountStatus",
    default: null,
})


export const mobileTokenModalStatus = atom<boolean>({
    key: "mobileTokenModalStatus",
    default: true,
});

export const mobileTokenAmountModalStatus = atom<SelectTokenModal>({
    key: "mobileTokenAmountModalStatus",
    default: {
        isOpen: null,
    },
});

