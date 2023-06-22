import { transactionModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";

export default function useTxModal() {
  const [modalOpen, setModalOpen] = useRecoilState(transactionModalStatus);

  return {
    txModalStatus: modalOpen,
    setTxModalStatus: setModalOpen,
  };
}
