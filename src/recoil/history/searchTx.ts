import { atom, selector } from "recoil";

type SearchTx = {
  id: string;
};

export const searchTxStatus = atom<SearchTx | null>({
  key: "searchTxStatus",
  default: null,
});
