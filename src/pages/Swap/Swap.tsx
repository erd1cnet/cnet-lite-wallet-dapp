import { useState, useEffect, useRef } from 'react';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { MxLink } from 'components';
import {
  useGetIsLoggedIn,
  useGetAccountInfo,
  useGetNetworkConfig,
  sendTransactions,
  prepareTransaction
} from 'lib';
import { DataTestIdsEnum } from 'localConstants';
import { routeNames } from 'routes';
import { CRYPTO_CURRENCIES } from './constants/currencies';
import { getUserTokenBalance } from './helpers/cnetApi';
import { TokenType } from './types';
//import * as Yup from 'yup';

const API_ADDRESS = 'https://testnet-api.cyber.network';

const stringToHex = (str: string) => {
  return Buffer.from(str, 'utf8').toString('hex');
};

const toHex = (value: BigNumber | string | number) => {
  let hexValue = new BigNumber(value).toString(16);
  if (hexValue.length % 2 !== 0) {
    hexValue = `0${hexValue}`;
  }
  return hexValue;
};

export const Swap = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address, account } = useGetAccountInfo();
  const {
    network: { chainId }
  } = useGetNetworkConfig();
  const [selectedFromToken, setSelectedFromToken] = useState('Select...');
  const [selectedToToken, setSelectedToToken] = useState('Select...');
  const [dropdownOpenFrom, setDropdownOpenFrom] = useState(false);
  const [dropdownOpenTo, setDropdownOpenTo] = useState(false);
  const [balanceFrom, setBalanceFrom] = useState(0);
  const [balanceTo, setBalanceTo] = useState(0);
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(routeNames.unlock);
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (address && selectedFromToken !== 'Select...') {
        const tokenFrom = CRYPTO_CURRENCIES.find(
          (token) => token.label === selectedFromToken
        ) as TokenType;
        if (tokenFrom) {
          const dataFrom = await getUserTokenBalance(
            API_ADDRESS,
            address,
            tokenFrom.id
          );
          if (dataFrom.length > 0) {
            const balance =
              dataFrom[0].balance / Math.pow(10, tokenFrom.decimal);
            setBalanceFrom(Math.floor(balance * 100) / 100);
          }
        }
      }
      if (address && selectedToToken !== 'Select...') {
        const tokenTo = CRYPTO_CURRENCIES.find(
          (token) => token.label === selectedToToken
        ) as TokenType;
        if (tokenTo) {
          const dataTo = await getUserTokenBalance(
            API_ADDRESS,
            address,
            tokenTo.id
          );
          if (dataTo.length > 0) {
            const balance = dataTo[0].balance / Math.pow(10, tokenTo.decimal);
            setBalanceTo(Math.floor(balance * 100) / 100);
          }
        }
      }
    };

    fetchBalances();
  }, [address, selectedFromToken, selectedToToken]);

  useEffect(() => {
    const calculateAmountTo = async () => {
      if (
        selectedFromToken !== 'Select...' &&
        selectedToToken !== 'Select...' &&
        amountFrom !== ''
      ) {
        const tokenFrom = CRYPTO_CURRENCIES.find(
          (token) => token.label === selectedFromToken
        ) as TokenType;
        const tokenTo = CRYPTO_CURRENCIES.find(
          (token) => token.label === selectedToToken
        ) as TokenType;

        if (tokenFrom && tokenTo && tokenFrom.pools) {
          const poolAddress = tokenFrom.pools[tokenTo.value.toLowerCase()];
          if (poolAddress) {
            const data = await getUserTokenBalance(
              API_ADDRESS,
              poolAddress,
              `${tokenFrom.id},${tokenTo.id}`
            );
            if (data.length === 2) {
              const fromPool = data.find(
                (token: any) => token.identifier === tokenFrom.id
              );
              const toPool = data.find(
                (token: any) => token.identifier === tokenTo.id
              );

              if (fromPool && toPool) {
                const fromPoolBalance = parseFloat(fromPool.balance);
                const toPoolBalance = parseFloat(toPool.balance);

                const k = fromPoolBalance * toPoolBalance;
                const firstTokenAmount =
                  parseFloat(amountFrom) * Math.pow(10, tokenFrom.decimal);

                const newFromPoolBalance = fromPoolBalance + firstTokenAmount;
                const newToPoolBalance = k / newFromPoolBalance;
                const secondTokenAmount =
                  (toPoolBalance - newToPoolBalance) * 0.9;

                setAmountTo(
                  (secondTokenAmount / Math.pow(10, tokenTo.decimal)).toFixed(2)
                );
              }
            }
          }
        }
      }
    };

    calculateAmountTo();
  }, [selectedFromToken, selectedToToken, amountFrom]);

  useEffect(() => {
    if (amountFrom === '') {
      setAmountTo('');
    }
  }, [amountFrom]);

  const dropdownFromRef = useRef<HTMLDivElement>(null);
  const dropdownToRef = useRef<HTMLDivElement>(null);

  const handleTokenSelectFrom = (token: any) => {
    setSelectedFromToken(token.label);
    setSelectedToToken('Select...'); // Reset To Token
    setDropdownOpenFrom(false);
    setBalanceTo(0); // Reset balanceTo when changing from token
  };

  const handleTokenSelectTo = (token: any) => {
    setSelectedToToken(token.label);
    setDropdownOpenTo(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownFromRef.current &&
      !dropdownFromRef.current.contains(event.target as Node)
    ) {
      setDropdownOpenFrom(false);
    }
    if (
      dropdownToRef.current &&
      !dropdownToRef.current.contains(event.target as Node)
    ) {
      setDropdownOpenTo(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const availableToTokens =
    selectedFromToken === 'WCNET'
      ? CRYPTO_CURRENCIES.filter((token) => token.label !== 'WCNET')
      : CRYPTO_CURRENCIES.filter((token) => token.label === 'WCNET');

  const formik = useFormik({
    initialValues: {
      amount: '',
      sliderValue: 0
    },

    onSubmit: async (values) => {
      if (
        new BigNumber(values.amount).isZero() ||
        values.amount == '' ||
        new BigNumber(balanceFrom) < new BigNumber(values.amount)
      ) {
        return;
      }

      const tokenFrom = CRYPTO_CURRENCIES.find(
        (token) => token.label === selectedFromToken
      ) as TokenType;
      const tokenTo = CRYPTO_CURRENCIES.find(
        (token) => token.label === selectedToToken
      ) as TokenType;

      if (tokenFrom && tokenTo) {
        const firstTokenAmount = toHex(
          new BigNumber(amountFrom).multipliedBy(
            new BigNumber(10).pow(tokenFrom.decimal)
          )
        );
        const secondTokenAmount = toHex(
          new BigNumber(amountTo).multipliedBy(
            new BigNumber(10).pow(tokenTo.decimal)
          )
        );
        const dataField = `ESDTTransfer@${stringToHex(
          tokenFrom.id
        )}@${firstTokenAmount}@${stringToHex(
          'swapTokensFixedInput'
        )}@${stringToHex(tokenTo.id)}@${secondTokenAmount}`;

        const transaction = prepareTransaction({
          receiver: tokenFrom.pools![tokenTo.value.toLowerCase()],
          amount: '0',
          gasLimit: '25000000',
          data: dataField,
          balance: '0',
          sender: account.address,
          gasPrice: '1000000000',
          nonce: account.nonce,
          chainId
        });

        setTransactionStatus('processing');

        try {
          await sendTransactions({
            transactions: [transaction],
            signWithoutSending: false,
            transactionsDisplayInfo: {
              processingMessage: 'Processing transaction...',
              errorMessage: 'Transaction failed',
              successMessage: 'Transaction successful'
            }
          });

          setTransactionStatus('success');
        } catch (error) {
          setTransactionStatus('failed');
        } finally {
          formik.resetForm();
        }
      }
    }
  });

  useEffect(() => {
    if (transactionStatus === 'success' || transactionStatus === 'failed') {
      formik.resetForm();
      setSelectedFromToken('Select...');
      setSelectedToToken('Select...');
      setBalanceFrom(0);
      setBalanceTo(0);
      setAmountFrom('');
      setAmountTo('');
      setTransactionStatus('');
    }
  }, [transactionStatus]);

  return (
    <div className='flex flex-col p-6 max-w-2xl w-full bg-white shadow-md rounded h-full'>
      <div className='flex flex-col'>
        <h2 className='text-2xl font-bold p-2 text-center'>Swap</h2>
        <p className='text-gray-400 text-center mb-8'>
          Trade tokens in an instant
        </p>
        <div className='text-sm border border-gray-200 rounded-xl p-6'>
          <form onSubmit={formik.handleSubmit}>
            <div className='mb-6'>
              <div className='flex justify-between items-center mb-1 mx-1'>
                <span className='text-xs'>Swap From:</span>
                <span className='text-xs'>
                  Balance: {balanceFrom} {selectedFromToken}
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
                    setAmountFrom(balanceFrom.toString());
                    formik.setFieldValue('amount', balanceFrom.toString());
                  }}
                >
                  MAX
                </button>
                <div
                  className='ml-2 p-2 relative bg-white rounded-l-full'
                  style={{ flexShrink: 0 }}
                  ref={dropdownFromRef}
                  onClick={() => setDropdownOpenFrom(!dropdownOpenFrom)}
                >
                  <button className='flex items-center'>
                    {selectedFromToken === 'Select...' ? (
                      <span className='text-gray-500'>{selectedFromToken}</span>
                    ) : (
                      <>
                        <img
                          src={
                            CRYPTO_CURRENCIES.find(
                              (token) => token.label === selectedFromToken
                            )?.icon
                          }
                          alt={selectedFromToken}
                          className='w-6 h-6 mr-2'
                        />
                        <span>{selectedFromToken}</span>
                      </>
                    )}
                  </button>
                  {dropdownOpenFrom && (
                    <div className='absolute mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                      {CRYPTO_CURRENCIES.map((token) => (
                        <button
                          key={token.value}
                          className='flex items-center w-full px-4 py-2 text-left hover:bg-gray-100'
                          onClick={() => handleTokenSelectFrom(token)}
                        >
                          <img
                            src={token.icon}
                            alt={token.label}
                            className='w-6 h-6 mr-2'
                          />
                          <span>{token.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='flex justify-center mb-2'>
              <span className='text-2xl'>↓</span>
            </div>

            <div className='mb-6'>
              <div className='flex justify-between items-center mb-1 mx-1'>
                <span className='text-xs'>Swap To:</span>
                <span className='text-xs'>
                  Balance: {balanceTo} {selectedToToken}
                </span>
              </div>
              <div className='flex items-center p-3 rounded-xl bg-gray-100'>
                <input
                  type='number'
                  placeholder='Amount'
                  value={amountTo}
                  onChange={(e) => setAmountTo(e.target.value)}
                  className='bg-transparent pl-3 text-black flex-grow outline-none no-arrows'
                  style={{ minWidth: '0' }}
                  disabled={selectedFromToken === 'Select...'}
                  name='amountTo'
                  onBlur={formik.handleBlur}
                />
                {/* {selectedToToken !== 'Select...' && (
                  <button type="button" className='bg-blue-500 text-white text-xs px-3 py-1 rounded-full ml-2'>
                    MAX
                  </button>
                )} */}
                <div
                  className='ml-2 p-2 relative bg-white rounded-l-full'
                  style={{ flexShrink: 0 }}
                  ref={dropdownToRef}
                  onClick={() => setDropdownOpenTo(!dropdownOpenTo)}
                >
                  <button
                    className='flex items-center'
                    disabled={selectedFromToken === 'Select...'}
                  >
                    {selectedToToken === 'Select...' ? (
                      <span className='text-gray-500'>{selectedToToken}</span>
                    ) : (
                      <>
                        <img
                          src={
                            CRYPTO_CURRENCIES.find(
                              (token) => token.label === selectedToToken
                            )?.icon
                          }
                          alt={selectedToToken}
                          className='w-6 h-6 mr-2'
                        />
                        <span>{selectedToToken}</span>
                      </>
                    )}
                  </button>
                  {dropdownOpenTo && (
                    <div className='absolute mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                      {availableToTokens.map((token) => (
                        <button
                          key={token.value}
                          className='flex items-center w-full px-4 py-2 text-left hover:bg-gray-100'
                          onClick={() => handleTokenSelectTo(token)}
                        >
                          <img
                            src={token.icon}
                            alt={token.label}
                            className='w-6 h-6 mr-2'
                          />
                          <span>{token.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              type='submit'
              className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white text-base'
            >
              Swap
            </button>
          </form>
        </div>

        <div className='mt-4 flex flex-col align-middle'>
          <MxLink
            className='block w-full mt-2 px-4 py-2 text-sm text-center text-blue-600'
            data-testid={DataTestIdsEnum.cancelBtn}
            to={routeNames.dashboard}
          >
            « Back
          </MxLink>
        </div>
      </div>
    </div>
  );
};
