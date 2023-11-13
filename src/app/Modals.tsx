import { SelectCardModal } from "@/components/card/SelectCard";
import ActionConfirmModal from "@/components/modal/ActionConfirmModal";
import Confirmation from "@/components/modal/Confirmation";
import TutorialModal from "@/components/modal/TutorialModal";
import ConfirmWithdraw from "@/components/modal/ConfirmWithdraw";
import ActionOptionModal from "@/components/modal/ActionOptionModal";

export default function Modals() {
  return (
    <>
      <SelectCardModal />
      <Confirmation />
      <ActionConfirmModal />
      <TutorialModal/>
      <ConfirmWithdraw/>
      <ActionOptionModal />
    </>
  );
}
