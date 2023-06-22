import { SelectCardModal } from "@/components/card/SelectCard";
import ActionConfirmModal from "@/components/modal/ActionConfirmModal";
import Confirmation from "@/components/modal/Confirmation";

export default function Modals() {
  return (
    <>
      <SelectCardModal />
      <Confirmation />
      <ActionConfirmModal />
    </>
  );
}
