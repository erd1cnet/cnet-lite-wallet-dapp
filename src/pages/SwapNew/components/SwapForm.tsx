import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { useSwapTransaction, useSwapForm, useTokenOptions } from '../hooks';
import { TokenType } from '../types';
import { useGetPendingTransactions } from 'lib';
import { ImageWithFallback } from '../components'; 
import { renderTokenLabel, getBalanceLabel, getBalanceUSD, getPriceLabel } from '../helpers';
import { DEFAULT_SVG_URL } from 'config';

interface SwapFormProps {
  address: string;
}

const SwapForm: React.FC<SwapFormProps> = ({ address }) => {
  const { tokens, loading, error } = useTokenOptions();
  const { performSwap } = useSwapTransaction();
  const [selectedFromToken, setSelectedFromToken] = useState<TokenType | null>(null);
  const [selectedToToken, setSelectedToToken] = useState<TokenType | null>(null);
  const [dropdownOpenFrom, setDropdownOpenFrom] = useState(false);
  const [dropdownOpenTo, setDropdownOpenTo] = useState(false);
  const dropdownFromRef = useRef<HTMLDivElement>(null);
  const dropdownToRef = useRef<HTMLDivElement>(null);
  const { pendingTransactions } = useGetPendingTransactions();

  const {
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
    tokenRoute,
    intermediaryAmounts
  } = useSwapForm(address, selectedFromToken, selectedToToken);

  const formik = useFormik({
    initialValues: {
      amount: '',
      tolerance: 0.01,
    },
    onSubmit: async (values) => {
      if (selectedFromToken && selectedToToken && pairs.length > 0) {
        const amountOutMin = (parseFloat(amountOut) * (1 - slippage / 100)).toFixed(4);
        await performSwap({
          amountIn: values.amount,
          selectedFromToken,
          selectedToToken,
          amountOutMin,
          pairAddress: pairs[0].address,
          pairs,
          tokenRoute,
          intermediaryAmounts,
          slippage
        });
      }
    },
  });

  const handleTokenSelectFrom = (token: TokenType) => {
    setSelectedFromToken(token);
    setDropdownOpenFrom(false);
  };

  const handleTokenSelectTo = (token: TokenType) => {
    setSelectedToToken(token);
    setDropdownOpenTo(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownFromRef.current && !dropdownFromRef.current.contains(event.target as Node)) {
        setDropdownOpenFrom(false);
      }
      if (dropdownToRef.current && !dropdownToRef.current.contains(event.target as Node)) {
        setDropdownOpenTo(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (Object.keys(pendingTransactions).length > 0) {
      setAmountFrom('');
      setAmountOut('');
    }
  }, [pendingTransactions]);

  if (loading) return <p>Loading tokens...</p>;
  if (error) return <p>Error loading tokens: {error.message}</p>;

  return (
    <div className='flex flex-col p-6 max-w-2xl w-full bg-white shadow-md rounded h-full'>
      <div className='flex flex-col'>
        <h2 className='text-2xl font-bold p-2 text-center'>Swap</h2>
        <p className='text-gray-400 text-center mb-8'>
          Trade tokens in an instant
        </p>
        <div className='text-sm border border-gray-200 rounded-xl p-6'>
          <div className='mb-6'>
            <div className='flex justify-between items-center mb-1 mx-1'>
              <span className='text-xs'>Swap From:</span>
              <span className='text-xs'>
                Balance: {selectedFromToken && getBalanceLabel(selectedFromToken, tokenBalances, pendingTransactions)} {selectedFromToken && renderTokenLabel(selectedFromToken)}
              </span>
            </div>
            <div className='flex items-center p-3 rounded-xl bg-gray-100'>
              <input
                type='number'
                placeholder='Amount'
                value={amountFrom}
                onChange={(e) => {
                  setAmountFrom(e.target.value);
                  formik.handleChange(e);
                }}
                className='bg-transparent pl-3 text-black flex-grow outline-none no-arrows'
                style={{ minWidth: '0' }}
                onBlur={formik.handleBlur}
                name='amount'
              />
              <button
                type='button'
                className='bg-blue-500 text-white text-xs px-3 py-1 rounded-full ml-2'
                onClick={() => {
                  const maxAmount = balanceFrom;
                  setAmountFrom(maxAmount.toString());
                  formik.setFieldValue('amount', maxAmount.toString());
                }}
              >
                MAX
              </button>
              <div
                className='ml-2 p-2 relative bg-white rounded-l-full'
                style={{ flexShrink: 0 }}
                ref={dropdownFromRef}
                onClick={(e) => { e.stopPropagation(); setDropdownOpenFrom(!dropdownOpenFrom); }}
              >
                <button className='flex items-center'>
                  {selectedFromToken ? (
                    <>
                      <ImageWithFallback
                        src={selectedFromToken.assets && selectedFromToken.assets.svgUrl ? selectedFromToken.assets.svgUrl : DEFAULT_SVG_URL}
                        alt={renderTokenLabel(selectedFromToken)}
                        className='w-6 h-6 mr-2' 
                      />
                      <span>{renderTokenLabel(selectedFromToken)}</span>
                    </>
                  ) : (
                    <span className='text-gray-500'>Select...</span>
                  )}
                </button>

                {dropdownOpenFrom && (
                  <div className='absolute mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                    {tokens.map((token) => (
                      <button
                        key={token.identifier}
                        className='flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100'
                        onClick={(e) => { e.stopPropagation(); handleTokenSelectFrom(token); }}
                      >
                        <div className='flex items-center'>
                          <ImageWithFallback
                            src={token.assets && token.assets.svgUrl ? token.assets.svgUrl : DEFAULT_SVG_URL}
                            alt={token.ticker}
                            className='w-6 h-6 mr-2' 
                          />
                          <div className='flex flex-col'>
                            <span>{renderTokenLabel(token)}</span>
                            <span className='text-gray-500 text-xs'>{getPriceLabel(token)}</span>
                          </div>
                        </div>
                        <div className='flex flex-col items-end'>
                          <span>{getBalanceLabel(token, tokenBalances, pendingTransactions)}</span>
                          <span className='text-gray-500 text-xs'>${getBalanceUSD(token, tokenBalances, pendingTransactions)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {selectedFromToken && (
              <div className='text-xs text-gray-600'>
                Total Value: ${getBalanceUSD(selectedFromToken, tokenBalances, pendingTransactions)}
              </div>
            )}
          </div>

          <div className='flex justify-center mb-2'>
            <span className='text-2xl'>↓</span>
          </div>

          <div className='mb-6'>
            <div className='flex justify-between items-center mb-1 mx-1'>
              <span className='text-xs'>Swap To:</span>
              <span className='text-xs'>
                Balance: {selectedToToken && getBalanceLabel(selectedToToken, tokenBalances, pendingTransactions)} {selectedToToken && renderTokenLabel(selectedToToken)}
              </span>
            </div>
            <div className='flex items-center p-3 rounded-xl bg-gray-100'>
              <input
                type='number'
                placeholder='Amount'
                value={amountOut}
                onChange={(e) => setAmountOut(e.target.value)}
                className='bg-transparent pl-3 text-black flex-grow outline-none no-arrows'
                style={{ minWidth: '0' }}
                disabled={!selectedFromToken}
                name='amountTo'
                onBlur={formik.handleBlur}
              />
              <div
                className='ml-2 p-2 relative bg-white rounded-l-full'
                style={{ flexShrink: 0 }}
                ref={dropdownToRef}
                onClick={(e) => { e.stopPropagation(); setDropdownOpenTo(!dropdownOpenTo); }}
              >
                <button
                  className='flex items-center'
                  disabled={!selectedFromToken}
                >
                  {selectedToToken ? (
                    <>
                      <ImageWithFallback
                        src={selectedToToken.assets && selectedToToken.assets.svgUrl ? selectedToToken.assets.svgUrl : DEFAULT_SVG_URL}
                        alt={renderTokenLabel(selectedToToken)}
                        className='w-6 h-6 mr-2'
                      />
                      <span>{renderTokenLabel(selectedToToken)}</span>
                    </>
                  ) : (
                    <span className='text-gray-500'>Select...</span>
                  )}
                </button>
                {dropdownOpenTo && (
                  <div className='absolute mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                    {tokens
                      .filter(token => token.identifier !== selectedFromToken?.identifier)
                      .map((token) => (
                        <button
                          key={token.identifier}
                          className='flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100'
                          onClick={(e) => { e.stopPropagation(); handleTokenSelectTo(token); }}
                        >
                          <div className='flex items-center'>
                            <ImageWithFallback
                              src={token.assets && token.assets.svgUrl ? token.assets.svgUrl : DEFAULT_SVG_URL}
                              alt={token.ticker}
                              className='w-6 h-6 mr-2'
                            />
                            <div className='flex flex-col'>
                              <span>{renderTokenLabel(token)}</span>
                              <span className='text-gray-500 text-xs'>{getPriceLabel(token)}</span>
                            </div>
                          </div>
                          <div className='flex flex-col items-end'>
                            <span>{getBalanceLabel(token, tokenBalances, pendingTransactions)}</span>
                            <span className='text-gray-500 text-xs'>${getBalanceUSD(token, tokenBalances, pendingTransactions)}</span>
                          </div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
            {selectedToToken && (
              <div className='text-xs text-gray-600'>
                Total Value: ${getBalanceUSD(selectedToToken, tokenBalances, pendingTransactions)}
              </div>
            )}
          </div>

          <div className='mb-6'>
            <label className='text-xs'>Slippage Tolerance:</label>
            <div className='flex justify-end mt-2 space-x-2'>
              {[0.1, 0.5, 1, 5].map((value) => (
                <button
                  key={value}
                  type='button'
                  className={`px-3 py-1 rounded-full text-xs ${slippage === value ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setSlippage(value)}
                >
                  {value}%
                </button>
              ))}
            </div>
            <div className='mt-2 text-right text-gray-600'>
              Slippage: {slippage}%
            </div>
          </div>
          <button
            type='button'
            className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white text-base'
            onClick={formik.submitForm} 
          >
            Swap
          </button>
        </div>

        <div className='mt-4 flex flex-col align-middle'>
          <a
            className='block w-full mt-2 px-4 py-2 text-sm text-center text-blue-600'
            href='/dashboard'
          >
            « Back
          </a>
        </div>
      </div>
      <div className='mt-6'>
        <h3 className='text-lg font-bold'>Swap Details</h3>
        <div className='border border-gray-200 rounded-xl p-4'>
          <div className='flex justify-between text-sm'>
            <span>Exchange rate</span>
            <span>1 {selectedFromToken?.ticker} ≈ {amountOut} {selectedToToken?.ticker}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span>Slippage tolerance</span>
            <span>{slippage}%</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span>Minimum received</span>
            <span>{(parseFloat(amountOut) * (1 - slippage / 100)).toFixed(2)} {selectedToToken?.ticker}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span>Liquidity provider fee</span>
            <span>{fees.join(', ')}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span>Price impact</span>
            <span>{priceImpact.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapForm;
