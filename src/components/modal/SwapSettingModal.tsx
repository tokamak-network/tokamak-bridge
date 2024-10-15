import { SettingContainer } from "../Setting";
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";

import { swapSettingStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import useMediaView from "@/hooks/mediaView/useMediaView";

const SwapSettingModal = () => {
  const [settingStatus, setSettingStatus] = useRecoilState(swapSettingStatus);
  const { mobileView } = useMediaView();

  return (
    <Modal
      isOpen={mobileView && settingStatus}
      onClose={() => {
        setSettingStatus(false);
      }}
      motionPreset="slideInBottom"
      autoFocus={mobileView && false}
    >
      <ModalOverlay opacity={0.1} />
      <ModalContent
        h={{ base: "calc(100% - 60px)", lg: "fit-content" }}
        bg={"#1F2128"}
        mt={"auto"}
        mb={0}
        roundedTop={"2xl"}
        height="auto"
      >
        <SettingContainer isModal />
      </ModalContent>
    </Modal>
  );
};

export default SwapSettingModal;
