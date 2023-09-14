import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
  tokenModalStatus,
} from "@/recoil/bridgeSwap/atom";
import { searchTokenStatus } from "@/recoil/card/selectCard/searchToken";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useConnectedNetwork from "../network";
import { TokenInfo } from "@/types/token/supportedToken";
import {
  bannerStatus,
  serviceSuspensionStatus,
} from "@/recoil/bridgeSwap/atom";
import { useInOutNetwork } from "@/hooks/network";
import { getWETHAddress, isETH } from "@/utils/token/isETH";

export default function useTokenModal() {
  const [tokenModal, setTokenModal] = useRecoilState(tokenModalStatus);
  const [, setSearchToken] = useRecoilState(searchTokenStatus);
  const status = useRecoilValue(bannerStatus);
  const suspended = useRecoilValue(serviceSuspensionStatus);
  const { inNetwork, outNetwork } = useInOutNetwork();
  const { layer, isConnectedToMainNetwork } = useConnectedNetwork();

  const isInTokenOpen = tokenModal?.isOpen === "INPUT";
  const isOutTokenOpen = tokenModal?.isOpen === "OUTPUT";

  const isL2 = inNetwork?.layer === "L2" || outNetwork?.layer === "L2";

  const onOpenInToken = () => {
    !suspended &&
      !(status === "Active" && isL2) &&
      setTokenModal({ isOpen: "INPUT", modalData: null });
  };
  const onOpenOutToken = () => {
    !suspended &&  !(status === "Active" && isL2) &&
      setTokenModal({ isOpen: "OUTPUT", modalData: null });
  };

  const onCloseTokenModal = () => {
    setSearchToken(null);
    setTokenModal({ isOpen: null, modalData: null });
  };

  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );

  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );
  const { chainName } = useConnectedNetwork();

  const setSelectedToken = useCallback(
    (
      tokenData: TokenInfo & {
        isNew?: boolean | undefined;
      }
    ) => {
      if (chainName) {
        const isDuplicated = isInTokenOpen
          ? selectedOutToken?.address[chainName] ===
            tokenData.address[chainName]
          : selectedInToken?.address[chainName] ===
            tokenData.address[chainName];

        //remove if same token is selected at other side
        if (isDuplicated) {
          if (isInTokenOpen) {
            setSelectedOutToken(null);
          } else {
            setSelectedInToken(null);
          }
        }

        isInTokenOpen && chainName
          ? setSelectedInToken({
              ...tokenData,
              amountBN: null,
              parsedAmount: null,
              tokenAddress: tokenData.address[chainName],
            })
          : chainName &&
            setSelectedOutToken({
              ...tokenData,
              amountBN: null,
              parsedAmount: null,
              tokenAddress: tokenData.address[chainName],
            });
      }
    },
    [chainName, selectedInToken, selectedOutToken]
  );

  return {
    isInTokenOpen,
    isOutTokenOpen,
    onOpenInToken,
    onOpenOutToken,
    onCloseTokenModal,
    setSelectedToken,
  };
}
