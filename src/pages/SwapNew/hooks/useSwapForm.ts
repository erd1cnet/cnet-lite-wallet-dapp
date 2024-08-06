import { useState, useEffect } from 'react';
import { getBalanceFromApi, executeSwap, fetchTokens } from '../helpers/api';
import { TokenType } from '../types';
import { useGetPendingTransactions } from 'lib';
import BigNumber from 'bignumber.js';


export const useSwapForm = (address: string, selectedFromToken: TokenType | null, selectedToToken: TokenType | null) => {
  const [balanceFrom, setBalanceFrom] = useState<number>(0.00);
  const [amountFrom, setAmountFrom] = useState<string>('');
  const [amountOut, setAmountOut] = useState<string>('');
  const [fees, setFees] = useState<string[]>([]);
  const [priceImpact, setPriceImpact] = useState<number>(0.00);
  const [slippage, setSlippage] = useState<number>(1);
  const [pairs, setPairs] = useState<{ address: string }[]>([]);
  const { pendingTransactions } = useGetPendingTransactions();
  const [tokenBalances, setTokenBalances] = useState<Record<string, { balance: number; usdValue: number }>>({});

  useEffect(() => {
    const fetchBalances = async () => {
      if (address) {
        try {
          const [balancesData, tokensData] = await Promise.all([
            getBalanceFromApi(address),
            fetchTokens(),
          ]);

          const tokensMap = tokensData.reduce((acc: Record<string, TokenType>, token: TokenType) => {
            acc[token.identifier] = token;
            return acc;
          }, {});

          const balancesMap = balancesData.reduce((acc: Record<string, { balance: BigNumber; usdValue: number }>, token: any) => {
            const balance = new BigNumber(token.balance).dividedBy(new BigNumber(10).pow(token.decimals));
            console.log(balance.toString());
            const price = new BigNumber(tokensMap[token.identifier]?.price || 0.00);
            const usdValue = balance.multipliedBy(price).toNumber();
            acc[token.identifier] = { balance, usdValue };
            return acc;
          }, {});

          setTokenBalances(balancesMap);

          if (selectedFromToken) setBalanceFrom(balancesMap[selectedFromToken.identifier]?.balance || 0.00);
        } catch (error) {
          console.error('Error fetching balances:', error);
        }
      }
    };

    fetchBalances();
  }, [address, selectedFromToken, selectedToToken, pendingTransactions]);

  useEffect(() => {
    const fetchAmountOut = async () => {
      if (selectedFromToken && selectedToToken && amountFrom) {
        try {
          const amountIn = BigInt(parseFloat(amountFrom) * Math.pow(10, selectedFromToken.decimals)).toString();
          const response = await executeSwap({
            amountIn,
            tokenInID: selectedFromToken.identifier,
            tokenOutID: selectedToToken.identifier,
            tolerance: 0.01,
          });
          if (response) {
            const calculatedAmountOut = (parseFloat(response.amountOut) / Math.pow(10, selectedToToken.decimals)).toFixed(4);
            setAmountOut(calculatedAmountOut);
            setFees(response.fees);
            setPriceImpact(parseFloat(response.pricesImpact[0]));
            setPairs(response.pairs);
          } else {
            console.error('Error: response is undefined');
          }
        } catch (error) {
          console.error('Error fetching swap amount out:', error);
        }
      }
    };

    fetchAmountOut();
  }, [selectedFromToken, selectedToToken, amountFrom, slippage]);

  return {
    balanceFrom,
    amountFrom,
    setAmountFrom,
    amountOut,
    setAmountOut,
    fees,
    priceImpact,
    slippage,
    setSlippage,
    pairs,
    tokenBalances,
  };
};
