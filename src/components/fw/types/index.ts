import { ChangeEvent } from "react";

export enum ModalType {
  Trade = "trade",
  History = "history",
}

export type FwConfirmModalType = {
  isOpen: boolean;
  type: ModalType;
};

export enum WarningType {
  Critical = "critical",
  Normal = "normal",
}

export interface FwInputProps {
  inputValue: string;
  inputWarningCheck: WarningType | "";
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export enum ButtonTypeMain {
  Cross = "cross",
  Standard = "standard",
}

export enum ButtonTypeSub {
  Recommend = "recommend",
  Advanced = "advanced",
}
