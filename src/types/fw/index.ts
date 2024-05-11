export enum ModalType {
  Trade = "trade",
  History = "history",
}

export type FwConfirmModalType = {
  isOpen: boolean;
  type: ModalType;
};
