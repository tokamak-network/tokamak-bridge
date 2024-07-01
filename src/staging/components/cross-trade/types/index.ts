import { CT_History } from "@/staging/types/transaction";
import { ChangeEvent, FocusEvent } from "react";

export enum ModalType {
  Trade = "trade",
  History = "history",
}

export type CTConfirmModalType = {
  isOpen: boolean;
  type: ModalType;
  txData: CT_History;
};

export enum WarningType {
  Critical = "critical",
  Normal = "normal",
}

export interface CTInputProps {
  inputValue: string;
  inputWarningCheck: WarningType | "";
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInputFocus?: (e: FocusEvent<HTMLInputElement>) => void;
}

export enum ButtonTypeMain {
  Cross = "cross",
  Standard = "standard",
}

export enum ButtonTypeSub {
  Recommend = "recommend",
  Advanced = "advanced",
}

export enum UpdateFeeButtonType {
  Update = "Update fee",
  CancelRequest = "Cancel request",
}
