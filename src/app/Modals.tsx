import { SelectCardModal } from "@/components/card/SelectCard";
import ActionConfirmModal from "@/components/modal/ActionConfirmModal";
import Confirmation from "@/components/modal/Confirmation";
import TutorialModal from "@/components/modal/TutorialModal";
import ActionOptionModal from "@/components/modal/ActionOptionModal";
import SwapSettingModal from "@/components/modal/SwapSettingModal";
import SelectTokenModal from "@/components/mobile/modal/SelectTokenModal";
import useMediaView from "@/hooks/mediaView/useMediaView";
import AmountInputModal from "@/components/mobile/modal/AmountInputModal";
import DepositWithdrawConfirmModal from "@/staging/components/new-confirm/components/core/other";
import SwapConfirmModal from "@/staging/components/new-confirm/components/core/swap";
import CTOptionModal from "@/staging/components/cross-trade/components/core/option";
import CTModal from "@/staging/components/cross-trade/components/core/comfirm";
import CTFeeUpdateModal from "@/staging/components/cross-trade/components/core/updateFee";
import { CTRefresh } from "@/staging/components/cross-trade/components/core/comfirm/CTRefresh";

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

      {/* <CTComingModal /> */}
      <CTOptionModal />
      <CTModal />
      <CTFeeUpdateModal />
      <CTRefresh />
    </>
  );
}
