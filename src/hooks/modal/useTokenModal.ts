import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
  tokenModalStatus,
} from "@/recoil/bridgeSwap/atom";
import {
  searchTokenStatus,
  isInputTokenAmount,
  isOutputTokenAmount,
} from "@/recoil/card/selectCard/searchToken";
import { mobileTokenModalStatus } from "@/recoil/mobile/atom";
import { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useConnectedNetwork from "../network";
import { TokenInfo } from "@/types/token/supportedToken";
import { bannerStatus } from "@/recoil/bridgeSwap/atom";
import { useInOutNetwork } from "@/hooks/network";
import useAmountModal from "@/hooks/modal/useAmountModal";
import { isETH, isWETH } from "@/utils/token/isETH";
import { useGetMode } from "../mode/useGetMode";

export default function useTokenModal() {
  const [tokenModal, setTokenModal] = useRecoilState(tokenModalStatus);
  const [mobileTokenModal, setMobileTokenModal] = useRecoilState(
    mobileTokenModalStatus,
  );

  const [, setSearchToken] = useRecoilState(searchTokenStatus);
  const [, setIsInputAmount] = useRecoilState(isInputTokenAmount);
  const status = useRecoilValue(bannerStatus);
  const { inNetwork, outNetwork } = useInOutNetwork();
  const [, setIsOutputAmount] = useRecoilState(isOutputTokenAmount);
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus,
  );

  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus,
  );
  const { chainName, connectedChainId } = useConnectedNetwork();
  const isInTokenOpen = tokenModal?.isOpen === "INPUT";
  const isOutTokenOpen = tokenModal?.isOpen === "OUTPUT";

  const simpleCloseCheck = mobileTokenModal;
  const { onCloseAmountModal } = useAmountModal();
  const { mode } = useGetMode();

  const isL2 = inNetwork?.layer === "L2" || outNetwork?.layer === "L2";

  const onOpenInToken = () => {
    !(status === "Active" && isL2) && //disable inToken select UI when the maintenance banner is active
      setTokenModal({ isOpen: "INPUT", modalData: null });
  };
  const onOpenOutToken = () => {
    !(status === "Active" && isL2) && //disable outToken select UI when the maintenance banner is active
      setTokenModal({ isOpen: "OUTPUT", modalData: null });
  };
  const simpleCloseTokenModal = () => {
    setMobileTokenModal(false);
  };

  const onCloseTokenModal = () => {
    setSearchToken(null);
    setTokenModal({ isOpen: null, modalData: null });
    setIsOutputAmount(false);

    if (!selectedInToken?.amountBN) {
      setIsInputAmount(false);
    }
  };

  const setSelectedToken = useCallback(
    (
      tokenData: TokenInfo & {
        isNew?: boolean | undefined;
      },
      isMobile?: boolean,
    ) => {
      if (chainName && connectedChainId) {
        const isDuplicated = isInTokenOpen
          ? selectedOutToken?.address[chainName] ===
            tokenData.address[chainName]
          : selectedInToken?.address[chainName] ===
            tokenData.address[chainName];
        //need to refact later to make it more readable
        const isETHPair =
          isInTokenOpen && isETH(tokenData)
            ? isWETH(selectedOutToken, chainName)
            : isInTokenOpen && isWETH(tokenData, chainName)
            ? isETH(selectedOutToken)
            : !isInTokenOpen && isETH(tokenData)
            ? isWETH(selectedInToken, chainName)
            : !isInTokenOpen && isWETH(tokenData, chainName)
            ? isETH(selectedInToken)
            : false;

        //remove if same token is selected at other side
        if (isDuplicated || (isETHPair && mode === "Pool")) {
          onCloseAmountModal();
          if (isMobile) {
            onCloseTokenModal();
            setIsInputAmount(false);
          }
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
    [
      chainName,
      selectedInToken,
      selectedOutToken,
      tokenModal,
      connectedChainId,
      mode,
    ],
  );

  return {
    isInTokenOpen,
    isOutTokenOpen,
    onOpenInToken,
    onOpenOutToken,
    onCloseTokenModal,
    setSelectedToken,
    simpleCloseTokenModal,
    simpleCloseCheck,
  };
}
