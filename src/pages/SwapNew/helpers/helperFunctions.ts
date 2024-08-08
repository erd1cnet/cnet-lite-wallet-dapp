import { TokenType } from '../types';

export const renderTokenLabel = (token: TokenType): string => {
  return token.assets && token.assets.svgUrl ? token.ticker : token.identifier;
};

export const formatNumber = (number: string | number): string => {
  return parseFloat(number.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const getBalanceLabel = (token: TokenType, tokenBalances: any, pendingTransactions: any): string => {
  if (Object.keys(pendingTransactions).length > 0) {
    return '--';
  }
  const balance = tokenBalances[token.identifier]?.balance || 0.00;
  return formatNumber(balance);
};

export const getBalanceUSD = (token: TokenType, tokenBalances: any, pendingTransactions: any): string => {
  if (Object.keys(pendingTransactions).length > 0) {
    return '--';
  }
  const usdValue = tokenBalances[token.identifier]?.usdValue || 0.00;
  return formatNumber(usdValue);
};

export const getPriceLabel = (token: TokenType): string => {
  const price = parseFloat(token.price || '0.00');
  return `$${formatNumber(price)}`;
};
