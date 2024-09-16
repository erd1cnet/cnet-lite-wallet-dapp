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
  value: string;
  label: string;
  id: string;
  decimal: number;
  name: string;
  icon: string;
  pools?: {
    [key: string]: string;
  };
}

