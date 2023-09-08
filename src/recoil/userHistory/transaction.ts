import { atom } from "recoil";
import { Erc20Type, SentMessages ,EthType,L1TxType } from "@/types/activity/history";

export const userTransactions = atom<any>({
key: 'userTransactions',
default:undefined
})