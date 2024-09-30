import { PoolCardDetail } from "@/app/pools/components/PoolCard";
import {
  CTConfirmModalType,
  ModalType,
} from "@/staging/components/cross-trade/types";
import {
  CT_History,
  StandardHistory,
  TransactionHistory,
} from "@/staging/types/transaction";
import { atom } from "recoil";

type withdrawModal = {
  isOpen: boolean;
  modalData?: any;
};
export const transactionModalStatus = atom<
  "confirming" | "confirmed" | "error" | null
>({
  key: "transactionModalStatus",
  default: null,
});

export const claimModalStatus = atom<boolean>({
  key: "claimModalStatus",
  default: false,
});
export const transactionModalOpenStatus = atom<boolean>({
  key: "transactionModalOpenStatus",
  default: false,
});

export const confirmModalStatus = atom<boolean>({
  key: "confirmModalStatus",
  default: false,
});

export const accountDrawerStatus = atom<boolean>({
  key: "accountDrawerStatus",
  default: false,
});

export type T_PoolModal =
  | "collectFee"
  | "increaseLiquidity"
  | "removeLiquidity"
  | "addLiquidity"
  | null;

export const poolModalStatus = atom<T_PoolModal>({
  key: "poolModalStatus",
  default: null,
});

export const confirmWithdrawData = atom<any>({
  key: "confirmWithdrawData",
  default: {
    modalData: null,
  },
});
export const confirmWithdrawStats = atom<withdrawModal>({
  key: "confirmWithdrawStats",
  default: {
    isOpen: false,
  },
});

export const poolModalProp = atom<PoolCardDetail | undefined>({
  key: "poolModalPropStatus",
  default: undefined,
});

export const mobileMenuStatus = atom<boolean>({
  key: "mobileMenuStatus",
  default: false,
});

export const actionMethodStatus = atom<boolean>({
  key: "actionMethodStatus",
  default: true,
});

export const swapSettingStatus = atom<boolean>({
  key: "swapSettingStatus",
  default: false,
});

export const ctConfirmModalStatus = atom<CTConfirmModalType>({
  key: "ctConfirmModalStatus",
  default: {
    isOpen: false,
    type: ModalType.Trade,
    txData: null,
  },
});

export const ctRefreshModalStatus = atom<{
  isOpen: boolean;
  saleCount: string | undefined;
  txData: CT_History | undefined;
}>({
  key: "ctRefreshModalStatus",
  default: {
    isOpen: false,
    saleCount: undefined,
    txData: undefined,
  },
});

export const ctOptionModalStatus = atom<boolean>({
  key: "ctOptionModalStatus",
  default: false,
});

export const ctUpdateFeeModalStatus = atom<{
  isOpen: boolean;
  txData: CT_History | null;
}>({
  key: "ctUpdateFeeModalStatus",
  default: {
    isOpen: false,
    txData: null,
  },
});

export const depositWithdrawConfirmModalStatus = atom<{
  isOpen: boolean;
  transaction: StandardHistory | undefined;
}>({
  key: "depositWithdrawConfirmModalStatus",
  default: {
    isOpen: false,
    transaction: undefined,
  },
});

export const thanosDepositWithdrawConfirmModalStatus = atom<{
  isOpen: boolean;
  transaction: TransactionHistory | undefined;
}>({
  key: "thanosDepositWithdrawConfirmModalStatus",
  default: {
    isOpen: false,
    transaction: undefined,
  },
});

export const swapConfirmModalStatus = atom<boolean>({
  key: "swapConfirmModalStatus",
  default: false,
});

export const pendingTransactionHashes = atom<string[]>({
  key: "pendingTransactionHashes",
  default: [],
});
