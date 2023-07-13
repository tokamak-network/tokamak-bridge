import { SelectCardModal } from "@/components/card/SelectCard";
import ActionConfirmModal from "@/components/modal/ActionConfirmModal";
import Confirmation from "@/components/modal/Confirmation";
import TutorialModal from "@/components/modal/TutorialModal";
import ConfirmWithdraw from "@/components/modal/ConfirmWithdraw";
export default function Modals() {
  return (
    <>
      <SelectCardModal />
      <Confirmation />
      <ActionConfirmModal />
      <TutorialModal/>
      <ConfirmWithdraw/>
    </>
  );
}
