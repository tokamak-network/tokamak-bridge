import { atom, selector } from "recoil";
import useGetTransaction from "@/hooks/user/useGetTransaction";

type SearchTx = {
    id: string
}

export const searchTxStatus = atom<SearchTx| null>({
    key:'searchTxStatus', 
    default:null
})

