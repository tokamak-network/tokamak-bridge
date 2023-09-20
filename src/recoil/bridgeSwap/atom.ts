import { ActionMode, InOutNetworks } from "@/types/bridgeSwap";
import { Field } from "@/types/swap/swap";
import { TokenInfo, supportedTokens } from "types/token/supportedToken";
import { atom, selector } from "recoil";
import { ethers } from "ethers";
import ERC20_ABI from "@/constant/abis/erc20.json";
import { useProvier } from "@/hooks/provider/useProvider";
import { loadingStatus } from "./isLoading";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

import {
  addWeeks,
  getISODay,
  format,
  startOfWeek,
  addDays,
  add,
  getTime,
} from "date-fns";
import { isETH } from "@/utils/token/isETH";

export const networkStatus = atom<InOutNetworks>({
  key: "networkStatus",
  default: {
    inNetwork: null,
    outNetwork: null,
  },
});

type SelectTokenModal = {
  isOpen: Field | null;
  modalData?: any;
};

export const tokenModalStatus = atom<SelectTokenModal>({
  key: "tokenModalStatus",
  default: {
    isOpen: null,
    modalData: null,
  },
});

type ConfirmWithdraw = boolean;

export const confirmWithdrawStatus = atom<ConfirmWithdraw>({
  key: "confirmWithdrawStatus",
  default: false,
});

export type SelectedToken = TokenInfo & {
  amountBN: BigInt | null;
  parsedAmount: string | null;
  tokenAddress: string | null;
};

export const selectedInTokenStatus = atom<SelectedToken | null>({
  key: "selectedInTokenStatus",
  default: null,
});

export const selectedOutTokenStatus = atom<SelectedToken | null>({
  key: "selectedOutTokenStatus",
  default: null,
});

type Banner = "Pending" | "Active" | "Hidden";

export const bannerStatus = atom<Banner>({
  key: "bannerStatus",
  default: "Hidden",
});

export const relayBannerStatus = atom<Banner>({
  key: "relayBannerStatus",
  default: "Hidden",
});

export const relayBannerSelector = selector<{
  previewTimeStartThisWeek: number;
}>({
  key: "relayBannerSelector",
  get: ({ get }) => {
    
      const today = new Date();
      // const currentISODay = getISODay(today);
      // const nowTime = getTime(today);
      // const desiredDateThisWeek = addDays(weekStart, 3);
      const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const uTCTime = zonedTimeToUtc(today, "Asia/Seoul");
      const zoneTime = utcToZonedTime(uTCTime, currentTimeZone);
    return {
      previewTimeStartThisWeek: getTime(zoneTime),
    };
  },
});

export const bannerSelector = selector<{ previewTimeStartThisWeek: number }>({
  key: "bannerSelector",
  get: ({ get }) => {
    const status = get(bannerStatus);
    const dayINeed = 4; // Thursday (ISO weekday 4)
    const network = get(networkStatus);
    const isTestnet =
      network.inNetwork?.chainId === SupportedChainId["GOERLI"] ||
      network.inNetwork?.chainId === SupportedChainId["DARIUS"] ||
      network.outNetwork?.chainId === SupportedChainId["GOERLI"] ||
      network.outNetwork?.chainId === SupportedChainId["DARIUS"];
    const today = new Date();
    const currentISODay = getISODay(today);
    const nowTime = getTime(today);
    // Calculate the start of the week (Monday) and add the desired ISO weekday to get this Wednesday
    const weekStart = startOfWeek(today);
    // const desiredDateThisWeek = addDays(weekStart, 3); // You can use `addDays(thisWed, dayINeed - 1)` as well
     const desiredDateThisWeek = addWeeks(addDays(weekStart, 3),1)
    const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const previewTimeStartThisWeek =
      isTestnet === true
        ? add(desiredDateThisWeek, {
            hours: 17,
            minutes: 30,
            seconds: 0,
          })
        : add(desiredDateThisWeek, {
            hours: 18,
            minutes: 0,
            seconds: 0,
          });

    const uTCTime = zonedTimeToUtc(previewTimeStartThisWeek, "Asia/Seoul");
    const zoneTime = utcToZonedTime(uTCTime, currentTimeZone);
    console.log('getTime(zoneTime)',getTime(zoneTime));
    
    return {
      previewTimeStartThisWeek: getTime(zoneTime),
    };
  },
});

export const inTokenSelector = selector<{ inTokenHasAmount: boolean }>({
  key: "inTokenSeletor",
  get: ({ get }) => {
    const inTokenStatus = get(selectedInTokenStatus);
    const inTokenHasAmount =
      inTokenStatus === null ? false : inTokenStatus?.amountBN !== null;
    return { inTokenHasAmount };
  },
});

export const outTokenSelector = selector<{ outTokenHasAmount: boolean }>({
  key: "outTokenSeletor",
  get: ({ get }) => {
    const outTokenStatus = get(selectedOutTokenStatus);
    const outTokenHasAmount =
      outTokenStatus === null ? false : outTokenStatus?.amountBN !== null;
    return { outTokenHasAmount };
  },
});

export const actionMode = selector<{ mode: ActionMode; isReady: boolean }>({
  key: "actionMode",
  get: ({ get }) => {
    const network = get(networkStatus);
    const { inTokenHasAmount } = get(inTokenSelector);
    const { outTokenHasAmount } = get(outTokenSelector);

    const inTokenStatus = get(selectedInTokenStatus);
    const outTokenStatus = get(selectedOutTokenStatus);

    if (network?.inNetwork && network?.outNetwork) {
      const isInTokenReady = inTokenHasAmount;
      const isOutTokenReady = outTokenHasAmount;

      const isWrap = [
        inTokenStatus?.address === supportedTokens[2].address &&
          outTokenStatus?.address === supportedTokens[3].address,
        inTokenStatus?.address === supportedTokens[3].address &&
          outTokenStatus?.address === supportedTokens[2].address,
      ];

      const isETHWrap = [
        isETH(inTokenStatus) &&
          outTokenStatus?.address === supportedTokens[1].address,
        inTokenStatus?.address === supportedTokens[1].address &&
          isETH(outTokenStatus),
      ];

      if (isWrap.includes(true) && network.inNetwork === network.outNetwork) {
        if (isWrap[0]) {
          return {
            mode: "Wrap",
            isReady: isInTokenReady,
          };
        }
        if (isWrap[1]) {
          return {
            mode: "Unwrap",
            isReady: isInTokenReady,
          };
        }
      }

      if (
        isETHWrap.includes(true) &&
        network.inNetwork === network.outNetwork
      ) {
        if (isETHWrap[0]) {
          return {
            mode: "ETH-Wrap",
            isReady: isInTokenReady,
          };
        }
        if (isETHWrap[1]) {
          return {
            mode: "ETH-Unwrap",
            isReady: isInTokenReady,
          };
        }
      }

      if (network.inNetwork.isTokamak && !network.outNetwork.isTokamak) {
        return {
          mode: "Withdraw",
          isReady: isInTokenReady,
        };
      }
      if (network.inNetwork === network.outNetwork) {
        return {
          mode: "Swap",
          isReady: isInTokenReady,
        };
      }
      return { mode: "Deposit", isReady: isInTokenReady };
    }
    return { mode: null, isReady: false };
  },
});
