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
  decimal: number;
}

export interface CrossTradeData {
  requester: string;
  inNetwork: number;
  outNetwork: number;
  inToken: Token;
  outToken: Token;
  profit: Profit;
  blockTimestamps: number;
  isActive: boolean;
}
