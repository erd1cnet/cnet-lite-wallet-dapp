import { useState, useEffect } from 'react';
import { getBalanceFromApi, executeSwap } from '../helpers/api';
import { TokenType } from '../types';
import { useGetPendingTransactions } from 'lib';

export const useSwapForm = (address: string, selectedFromToken: TokenType | null, selectedToToken: TokenType | null) => {
  const [balanceFrom, setBalanceFrom] = useState<number>(0);
  const [balanceTo, setBalanceTo] = useState<number>(0);
  const [amountFrom, setAmountFrom] = useState<string>('');
  const [amountOut, setAmountOut] = useState<string>('');
  const [fees, setFees] = useState<string[]>([]);
  const [priceImpact, setPriceImpact] = useState<number>(0);
  const [slippage, setSlippage] = useState<number>(1);
  const [pairs, setPairs] = useState<{ address: string }[]>([]);
  const { pendingTransactions } = useGetPendingTransactions();

  useEffect(() => {
    const fetchBalances = async () => {
      if (address) {
        try {
          const data = await getBalanceFromApi(address);
          const balancesMap = data.reduce((acc: Record<string, number>, token: any) => {
            acc[token.identifier] = parseFloat(token.balance) / Math.pow(10, token.decimals);
            return acc;
          }, {});
          setBalanceFrom(balancesMap[selectedFromToken?.identifier || ''] || 0);
          setBalanceTo(balancesMap[selectedToToken?.identifier || ''] || 0);
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
          const response = await executeSwap({
            amountIn: (parseFloat(amountFrom) * Math.pow(10, selectedFromToken.decimals)).toString(),
            tokenInID: selectedFromToken.identifier,
            tokenOutID: selectedToToken.identifier,
            tolerance: slippage / 100,
          });
          if (response) {
            const calculatedAmountOut = (parseFloat(response.amountOut) / Math.pow(10, selectedToToken.decimals)).toFixed(2);
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
    balanceTo,
    amountFrom,
    setAmountFrom,
    amountOut,
    setAmountOut,
    fees,
    priceImpact,
    slippage,
    setSlippage,
    pairs,
    setBalanceFrom,
    setBalanceTo,
  };
};
