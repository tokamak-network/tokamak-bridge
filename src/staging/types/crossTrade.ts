import { SupportedChainId } from "@/types/network/supportedNetwork";
import { T_FETCH_REQUEST_LIST_L2 } from "../hooks/useCrossTrade";

export interface Token {
  address: string;
  name: string;
  symbol: string;
  amount: string;
  decimals: number;
}

export interface Profit {
  amount: string;
  symbol: string;
  percent: string;
  decimals: number;
}

export interface CrossTradeData {
  requester: string;
  inNetwork: SupportedChainId;
  outNetwork: SupportedChainId;
  inToken: Token;
  outToken: Token;
  profit: Profit;
  blockTimestamps: number;
  isActive: boolean;
  providingUSD: number;
  recevingUSD: number;
  subgraphData: T_FETCH_REQUEST_LIST_L2;
  isProvided: boolean;
  serviceFee: BigInt;
  isCanceled: boolean;
}
