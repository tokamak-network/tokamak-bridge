import { SelectCardModal } from "@/components/card/SelectCard";
import ActionConfirmModal from "@/components/modal/ActionConfirmModal";
import Confirmation from "@/components/modal/Confirmation";
import TutorialModal from "@/components/modal/TutorialModal";
import ConfirmWithdraw from "@/components/modal/ConfirmWithdraw";
import ActionOptionModal from "@/components/modal/ActionOptionModal";
import SwapSettingModal from "@/components/modal/SwapSettingModal";
import SelectTokenMobileModal from "@/components/mobile/modal/SelectTokenMobile";
import useMediaView from "@/hooks/mediaView/useMediaView";

export default function Modals() {
  const { mobileView } = useMediaView();
  
  return (
    <>
      {mobileView ? 
        <SelectTokenMobileModal /> :
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