// types/index.ts
export interface TokenOptionType {
  label: string;
  value: string;
}

export enum SendTypeEnum {
  esdt = 'ESDT',
  nft = 'NFT'
}

export enum FormFieldsEnum {
  amount = 'amount',
  data = 'data',
  gasLimit = 'gasLimit',
  receiver = 'receiver',
  token = 'token',
  type = 'type'
}

export interface SendFormType {
  amount: string;
  data: string;
  gasLimit: number;
  receiver: string;
  token: TokenOptionType;
  type: string;
}

export interface TokenType {
  name: string;
  ticker: string;
  identifier: string;
  assets: {
    website: string;
    description: string;
    status: string;
    pngUrl: string;
    svgUrl: string;
    __typename: string;
  } | null; 
  decimals: number;
  price: string;
  __typename: string;
  pools?: {
    [key: string]: string;
  };
}

export interface SwapResponseType {
  amountIn: string;
  tokenInID: string;
  tokenInPriceUSD: string;
  tokenInExchangeRateDenom: string;
  amountOut: string;
  tokenOutID: string;
  tokenOutPriceUSD: string;
  tokenOutExchangeRateDenom: string;
  fees: string[];
  swapType: number;
  tokenRoute: string[];
  pricesImpact: string[];
  maxPriceDeviationPercent: number;
  tokensPriceDeviationPercent: number | null;
  intermediaryAmounts: string[];
  pairs: Pair[];
  __typename: string;
}

export interface Pair {
  address: string;
  state: string;
  type: string;
  firstToken: TokenType;
  secondToken: TokenType;
  secondTokenPrice: string;
  __typename: string;
}

export interface SwapTransactionParams {
  amountIn: string;
  selectedFromToken: TokenType;
  selectedToToken: TokenType;
  amountOutMin: string;
  pairAddress: string;
  pairs: { address: string }[];
  tokenRoute: string[];
  intermediaryAmounts: string[];
  slippage: number
}