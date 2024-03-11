import { SelectCardModal } from "@/components/card/SelectCard";
import ActionConfirmModal from "@/components/modal/ActionConfirmModal";
import Confirmation from "@/components/modal/Confirmation";
import TutorialModal from "@/components/modal/TutorialModal";
import ConfirmWithdraw from "@/components/modal/ConfirmWithdraw";
import ConfirmDeposit from "@/components/modal/ConfirmDeposit";
import ActionOptionModal from "@/components/modal/ActionOptionModal";
import SwapSettingModal from "@/components/modal/SwapSettingModal";

export default function Modals() {
  return (
    <>
      <SelectCardModal />
      <Confirmation />
      <ActionConfirmModal />
      <TutorialModal />
      <ConfirmWithdraw />
      <ConfirmDeposit />
      <ActionOptionModal />
      <SwapSettingModal />
    </>
  );
}
