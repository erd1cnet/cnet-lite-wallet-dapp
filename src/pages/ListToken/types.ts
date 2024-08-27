import { GetTransactionsByHashesType } from "@multiversx/sdk-dapp/types";

export interface TokenType {
    name: string;
    ticker: string;
    identifier: string;
    owner: string;
    balance: number;
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

  export interface TransactionsTrackerType {
    getTransactionsByHash?: GetTransactionsByHashesType;
    onSuccess?: (sessionId: string | null) => void;
    onFail?: (sessionId: string | null, errorMessage?: string) => void;
  }
  