import { SelectCardModal } from "@/components/card/SelectCard";
import Confirmation from "@/components/modal/Confirmation";
import TxToast from "@/components/toast/TxToast";
export default function Modals() {
  return (
    <>
      <SelectCardModal />
      <Confirmation />
      <TxToast/>
    </>
  );
}
