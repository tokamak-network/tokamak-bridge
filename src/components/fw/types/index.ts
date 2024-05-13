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

export interface FwOptionCrossDetailProps {
  inputValue: string;
  inputWarningCheck: WarningType | "";
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export enum ButtonType {
  Recommend = "recommend",
  Advanced = "advanced",
}
