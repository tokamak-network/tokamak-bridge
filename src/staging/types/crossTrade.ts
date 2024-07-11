import { SupportedChainId } from "@/types/network/supportedNetwork";

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
}
