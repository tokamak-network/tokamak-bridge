import { atom } from "recoil";

export enum ButtonType_Pools {
  CROSS_TRADE = "Cross_Trade",
  UNISWAP_POOL = "Uniswap_Pool",
}

export const ATOM_pool_page = atom<ButtonType_Pools>({
  key: "ATOM_pool_page",
  default: ButtonType_Pools.CROSS_TRADE,
});
