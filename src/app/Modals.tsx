import { SelectCardModal } from "@/components/card/SelectCard";
import ActionConfirmModal from "@/components/modal/ActionConfirmModal";
import Confirmation from "@/components/modal/Confirmation";
import TutorialModal from "@/components/modal/TutorialModal";
import ConfirmWithdraw from "@/components/modal/ConfirmWithdraw";
import ActionOptionModal from "@/components/modal/ActionOptionModal";
import SwapSettingModal from "@/components/modal/SwapSettingModal";
import SelectTokenModal from "@/components/mobile/modal/SelectTokenModal";
import useMediaView from "@/hooks/mediaView/useMediaView";
import AmountInputModal from "@/components/mobile/modal/AmountInputModal";
import CTComingModal from "@/staging/components/cross-trade/components/core/coming/swap";
import DepositWithdrawConfirmModal from "@/staging/components/new-confirm/components/core/other";
import SwapConfirmModal from "@/staging/components/new-confirm/components/core/swap";

export default function Modals() {
  const { mobileView } = useMediaView();

  return (
    <>
      {mobileView ? (
        <>
          <SelectTokenModal />
          <AmountInputModal />
        </>
      ) : (
        <SelectCardModal />
      )}
      <Confirmation />
      <TutorialModal />
      <ActionOptionModal />
      <SwapSettingModal />

      {/**new confirm modal @Robert */}
      {/*
       * <ConfirmWithdraw />
       * <ActionConfirmModal />
       */}
      <DepositWithdrawConfirmModal />
      <SwapConfirmModal />

      {/**FW coming modal @Robert */}
      <CTComingModal />
      {/* 
        <CTOptionModal />
        <CTModal />
        <CTFeeUpdateModal /> 
      */}
    </>
  );
}
