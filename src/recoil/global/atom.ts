import { SupportedChainProperties } from "@/types/network/supportedNetwork";
import { atom } from "recoil";

type NetworkAtom = SupportedChainProperties | undefined;

export const networkStatus = atom<NetworkAtom>({
  key: "userNetwork",
  default: undefined,
});
