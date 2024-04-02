import { SelectCardModal } from "@/components/card/SelectCard";
import ActionConfirmModal from "@/components/modal/ActionConfirmModal";
import Confirmation from "@/components/modal/Confirmation";
import TutorialModal from "@/components/modal/TutorialModal";
import ConfirmWithdraw from "@/components/modal/ConfirmWithdraw";
import ActionOptionModal from "@/components/modal/ActionOptionModal";
import SwapSettingModal from "@/components/modal/SwapSettingModal";
import SelectTokenModal from "@/components/mobile/modal/SelectTokenModal";
import useMediaView from "@/hooks/mediaView/useMediaView";

export default function Modals() {
  const { mobileView } = useMediaView();
  
  return (
    <>
      {mobileView ? 
        <SelectTokenModal />
        : 
        <SelectCardModal />
      }
      <Confirmation />
      <ActionConfirmModal />
      <TutorialModal/>
      <ConfirmWithdraw/>
      <ActionOptionModal />
      <SwapSettingModal />
    </>
  );
}