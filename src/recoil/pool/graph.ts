import { atom } from "recoil";

export const ATOM_graph_isLoading = atom<boolean>({
  key: "graph_isLoading",
  default: false,
});
