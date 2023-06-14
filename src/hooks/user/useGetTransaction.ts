import { transactionData } from "@/recoil/global/transaction";
import { useRecoilValue } from "recoil";

export default function useGetTransaction() {
  const tData = useRecoilValue(transactionData);

  return tData;
}
