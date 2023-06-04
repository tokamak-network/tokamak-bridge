import  {Token} from '@uniswap/sdk-core';

export type InRange = true | false;

export interface TokenPairSymbol {
    inTokenSymbol: string;
    outTokenSymbol: string;
}

export interface PriceDetail {
    inputAmount: number;
    outTokenAmount: number;
    gasFee: number;
}

export interface PoolCardDetail {
    id?: number; 
    // in: Token,
    // out: Token,
    in: string,
    out: string,
    slippage: string,
    range: InRange,
    symbol: TokenPairSymbol,
    trade:PriceDetail
}