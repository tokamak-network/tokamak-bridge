import { fwOptionModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useCallback } from "react";

export default function useFwOption() {
  const [fwOptionModal, setFwOptionModal] = useRecoilState(fwOptionModalStatus);

  const onOpenFwOptionModal = () => {
    setFwOptionModal(true);
  };

  const onCloseFwOptionModal = useCallback(() => {
    setFwOptionModal(false);
  }, []);

  return {
    fwOptionModal,
    onOpenFwOptionModal,
    onCloseFwOptionModal,
  };
}
