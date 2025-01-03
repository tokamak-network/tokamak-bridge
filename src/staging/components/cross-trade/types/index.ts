import { sub } from "date-fns";
import { CT_History } from "@/staging/types/transaction";
import { ChangeEvent, FocusEvent } from "react";
import { T_FETCH_REQUEST_LIST_L2 } from "@/staging/hooks/useCrossTrade";

export enum ModalType {
  Trade = "trade",
  History = "history",
}

export type CTConfirmModalType = {
  isOpen: boolean;
  type: ModalType;
  txData: CT_History | null;
  isProvide?: boolean;
  subgraphData?: T_FETCH_REQUEST_LIST_L2;
  forConfirmProviding?: {
    isUpdateFee: boolean;
    initialCTAmount: string;
    editedCTAmount: bigint;
  };
};

export enum WarningType {
  Critical = "critical",
  Normal = "normal",
}

export interface CTInputProps {
  inputValue: string;
  inputWarningCheck: WarningType | "";
  inTokenSymbol?: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInputFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  recommnededFee?: string;
  isAdvancedActive?: boolean;
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
  Update = "Service fee",
  CancelRequest = "Cancel",
}
