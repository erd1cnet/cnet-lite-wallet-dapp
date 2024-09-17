import { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import ImageWithFallback from '../components/ImageWithFallback';
import {
  checkPairExistence,
  getFromLocalStorage,
  pollTransactionStatus,
  updateStorage
} from '../helpers';
import { useCreatePoolForm, useCreatePoolsTransaction } from '../hooks';

const CreatePool = () => {
  const { filteredUserTokens, commonTokens } = useCreatePoolForm();
  const {
    createPair,
    issueLpToken,
    setLocalRoles,
    addInitialLiquidity,
    setSwapEnabledByUser
  } = useCreatePoolsTransaction();
  const DEFAULT_SVG_URL = '/assets/img/default.svg';

  const [selectedUserToken, setSelectedUserToken] = useState<string>('');
  const [selectedCommonToken, setSelectedCommonToken] = useState<string>('');
  const [pairExists, setPairExists] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionPending, setTransactionPending] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  const [dropdownOpenUser, setDropdownOpenUser] = useState(false);
  const [dropdownOpenCommon, setDropdownOpenCommon] = useState(false);

  const storedData = getFromLocalStorage('poolCreation');

  useEffect(() => {
    if (filteredUserTokens.length > 0) {
      setSelectedUserToken(filteredUserTokens[0].identifier);
    }
    if (commonTokens.length > 0) {
      setSelectedCommonToken(commonTokens[0].identifier);
    }
  }, [filteredUserTokens, commonTokens]);

  useEffect(() => {
    const checkPair = async () => {
      if (selectedUserToken && selectedCommonToken) {
        try {
          const { falsePair, truePair } = await checkPairExistence(
            selectedUserToken,
            selectedCommonToken
          );

          if (falsePair.length > 0 && truePair.length === 0) {
            setPairExists(true);
            setCanContinue(true);
            setErrorMessage(
              'Pair already exists. You can continue with issuing the LP token.'
            );
          } else if (falsePair.length > 0 && truePair.length > 0) {
            setPairExists(true);
            setCanContinue(false);
            setErrorMessage('Pair already exists with an issued LP token.');
          } else {
            setPairExists(false);
            setCanContinue(false);
            setErrorMessage(null);
          }
        } catch (error) {
          console.error('Error checking pair existence:', error);
          setErrorMessage('Error checking pair existence');
        }
      }
    };

    checkPair();
  }, [selectedUserToken, selectedCommonToken]);

  useEffect(() => {
    if (storedData) {
      setCurrentStep(storedData.data.step);
    }
  }, [storedData]);

  useEffect(() => {
    const monitorTransactionStatus = async () => {
      if (transactionPending && transactionHash) {
        const transactionStatus = await pollTransactionStatus(transactionHash);

        if (transactionStatus?.status.isExecuted) {
          handleSuccess();
        } else if (transactionStatus?.status.isFailed) {
          handleFailure();
        } else {
          setTimeout(monitorTransactionStatus, 1000);
        }
      }
    };

    monitorTransactionStatus();
  }, [transactionPending, transactionHash]);

  const handleSuccess = () => {
    setTransactionPending(false);
    switch (currentStep) {
      case null:
        setCurrentStep('2_issueLpToken');
        updateStorage('poolCreation', {
          step: '2_issueLpToken',
          pairAddress: transactionHash
        });
        break;
      case '2_issueLpToken':
        setCurrentStep('3_setRoles');
        updateStorage('poolCreation', { step: '3_setRoles' });
        break;
      case '3_setRoles':
        setCurrentStep('4_addLiquidity');
        updateStorage('poolCreation', { step: '4_addLiquidity' });
        break;
      case '4_addLiquidity':
        setCurrentStep('5_enableSwap');
        updateStorage('poolCreation', { step: '5_enableSwap' });
        break;
      case '5_enableSwap':
        setCurrentStep(null);
        localStorage.removeItem('poolCreation');
        break;
      default:
        break;
    }
  };

  const handleFailure = () => {
    setTransactionPending(false);
    setErrorMessage('Transaction failed or not completed.');
  };

  const handleTokenSelectUser = (identifier: string) => {
    setSelectedUserToken(identifier);
    setDropdownOpenUser(false);
  };

  const handleTokenSelectCommon = (identifier: string) => {
    setSelectedCommonToken(identifier);
    setDropdownOpenCommon(false);
  };

  const handleGeneratePoolAddress = async () => {
    try {
      const selectedUserTokenObj = filteredUserTokens.find(
        (token) => token.identifier === selectedUserToken
      );
      const selectedCommonTokenObj = commonTokens.find(
        (token) => token.identifier === selectedCommonToken
      );

      if (selectedUserTokenObj && selectedCommonTokenObj) {
        const hash = await createPair({
          firstTokenId: selectedUserTokenObj.identifier,
          secondTokenId: selectedCommonTokenObj.identifier,
          optFeePercents: [0, 0]
        });
        console.log('firat', hash);
        if (hash) {
          setTransactionHash(hash);
          setTransactionPending(true);
        }
      }
    } catch (error) {
      console.error('Error generating pool address:', error);
      setErrorMessage('Error generating pool address');
    }
  };

  const handleIssueLpToken = async () => {
    if (storedData && storedData.data.pairAddress) {
      const { pairAddress } = storedData.data;
      const selectedUserTokenObj = filteredUserTokens.find(
        (token) => token.identifier === selectedUserToken
      );
      const selectedCommonTokenObj = commonTokens.find(
        (token) => token.identifier === selectedCommonToken
      );

      if (selectedUserTokenObj && selectedCommonTokenObj) {
        const hash = await issueLpToken(
          pairAddress,
          selectedUserTokenObj.ticker,
          selectedCommonTokenObj.ticker
        );

        if (hash) {
          setTransactionHash(hash);
          setTransactionPending(true);
        }
      }
    }
  };

  const handleSetLocalRoles = async () => {
    if (storedData && storedData.data.pairAddress) {
      const { pairAddress } = storedData.data;
      const hash = await setLocalRoles(pairAddress);

      if (hash) {
        setTransactionHash(hash);
        setTransactionPending(true);
      }
    }
  };

  const handleAddInitialLiquidity = async () => {
    if (storedData && storedData.data.pairAddress) {
      const { pairAddress } = storedData.data;
      const selectedUserTokenObj = filteredUserTokens.find(
        (token) => token.identifier === selectedUserToken
      );
      const selectedCommonTokenObj = commonTokens.find(
        (token) => token.identifier === selectedCommonToken
      );

      if (selectedUserTokenObj && selectedCommonTokenObj) {
        const hash = await addInitialLiquidity(
          pairAddress,
          selectedUserTokenObj.identifier,
          '1000000',
          selectedCommonTokenObj.identifier,
          '2000000'
        );

        if (hash) {
          setTransactionHash(hash);
          setTransactionPending(true);
        }
      }
    }
  };

  const handleEnableSwap = async () => {
    if (storedData && storedData.data.pairAddress) {
      const { pairAddress } = storedData.data;
      const hash = await setSwapEnabledByUser(pairAddress);

      if (hash) {
        setTransactionHash(hash);
        setTransactionPending(true);
      }
    }
  };

  const handleContinue = async () => {
    switch (currentStep) {
      case null:
        await handleGeneratePoolAddress();
        break;
      case '2_issueLpToken':
        await handleIssueLpToken();
        break;
      case '3_setRoles':
        await handleSetLocalRoles();
        break;
      case '4_addLiquidity':
        await handleAddInitialLiquidity();
        break;
      case '5_enableSwap':
        await handleEnableSwap();
        break;
      default:
        break;
    }
  };

  const formatBalance = (balance: number, decimals: number) => {
    const formatted = new BigNumber(balance).dividedBy(
      new BigNumber(10).pow(decimals)
    );
    return formatted.toFormat(2);
  };

  return (
    <div className='flex flex-col p-6 max-w-2xl w-full bg-white shadow-md rounded h-full items-center'>
      <h2 className='text-2xl font-bold p-2'>Create Pool</h2>
      <p className='text-gray-400 mb-8'>
        Create pools using the tokens you minted.
      </p>
      <div className='p-6 rounded-lg border border-gray-200 shadow-xl w-full max-w-md'>
        {currentStep === null && (
          <>
            <div className='space-y-4'>
              <div className='relative'>
                <button
                  className={`w-full p-3 rounded-xl bg-gray-100 flex items-center justify-between ${
                    transactionPending && 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() =>
                    !transactionPending &&
                    setDropdownOpenUser(!dropdownOpenUser)
                  }
                  disabled={transactionPending}
                >
                  {selectedUserToken ? (
                    <>
                      <ImageWithFallback
                        src={
                          filteredUserTokens.find(
                            (token) => token.identifier === selectedUserToken
                          )?.assets?.svgUrl || DEFAULT_SVG_URL
                        }
                        alt={
                          filteredUserTokens.find(
                            (token) => token.identifier === selectedUserToken
                          )?.ticker || selectedUserToken
                        }
                        className='w-6 h-6 mr-2'
                      />
                      <span>
                        {filteredUserTokens.find(
                          (token) => token.identifier === selectedUserToken
                        )?.ticker || selectedUserToken}
                      </span>
                    </>
                  ) : (
                    <span className='text-gray-500'>Select a token</span>
                  )}
                  <span className='ml-auto'>▼</span>
                </button>
                {dropdownOpenUser && (
                  <div className='absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                    {filteredUserTokens.map((token) => (
                      <button
                        key={token.identifier}
                        className='flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100'
                        onClick={() => handleTokenSelectUser(token.identifier)}
                      >
                        <div className='flex items-center'>
                          <ImageWithFallback
                            src={token.assets?.svgUrl || DEFAULT_SVG_URL}
                            alt={token.ticker || token.identifier}
                            className='w-6 h-6 mr-2'
                          />
                          <span>{token.ticker || token.identifier}</span>
                        </div>
                        <div className='text-right'>
                          <span>
                            {formatBalance(
                              Number(token.balance),
                              token.decimals
                            )}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className='flex justify-center mb-2'>
                <span className='text-2xl'>+</span>
              </div>
              <div className='relative'>
                <button
                  className={`w-full p-3 rounded-xl bg-gray-100 flex items-center justify-between ${
                    transactionPending && 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() =>
                    !transactionPending &&
                    setDropdownOpenCommon(!dropdownOpenCommon)
                  }
                  disabled={transactionPending}
                >
                  {selectedCommonToken ? (
                    <>
                      <ImageWithFallback
                        src={
                          commonTokens.find(
                            (token) => token.identifier === selectedCommonToken
                          )?.assets?.svgUrl || DEFAULT_SVG_URL
                        }
                        alt={
                          commonTokens.find(
                            (token) => token.identifier === selectedCommonToken
                          )?.ticker || selectedCommonToken
                        }
                        className='w-6 h-6 mr-2'
                      />
                      <span>
                        {commonTokens.find(
                          (token) => token.identifier === selectedCommonToken
                        )?.ticker || selectedCommonToken}
                      </span>
                    </>
                  ) : (
                    <span className='text-gray-500'>Select a token</span>
                  )}
                  <span className='ml-auto'>▼</span>
                </button>
                {dropdownOpenCommon && (
                  <div className='absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                    {commonTokens.map((token) => (
                      <button
                        key={token.identifier}
                        className='flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100'
                        onClick={() =>
                          handleTokenSelectCommon(token.identifier)
                        }
                      >
                        <div className='flex items-center'>
                          <ImageWithFallback
                            src={token.assets?.svgUrl || DEFAULT_SVG_URL}
                            alt={token.ticker || token.identifier}
                            className='w-6 h-6 mr-2'
                          />
                          <span>{token.ticker || token.identifier}</span>
                        </div>
                        <div className='text-right'>
                          <span>
                            {formatBalance(
                              Number(token.balance),
                              token.decimals
                            )}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errorMessage && (
                <p className='text-red-500 text-center mt-2'>{errorMessage}</p>
              )}
              {canContinue && (
                <button
                  className='w-full rounded-lg bg-green-600 hover:bg-green-700 px-4 py-3 text-white text-base'
                  onClick={handleContinue}
                  disabled={transactionPending}
                >
                  {transactionPending ? 'Processing...' : 'Continue'}
                </button>
              )}
              {!storedData && !canContinue && (
                <button
                  className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white text-base'
                  onClick={handleGeneratePoolAddress}
                  disabled={pairExists || transactionPending}
                >
                  {transactionPending
                    ? 'Processing...'
                    : 'Generate Pool Address'}
                </button>
              )}
            </div>
          </>
        )}

        {currentStep === '2_issueLpToken' && (
          <div className='space-y-4'>
            <div>
              <label>Pool Address</label>
              <input
                type='text'
                value={storedData.data.pairAddress}
                readOnly
                className='w-full p-3 rounded-lg bg-gray-100'
              />
            </div>
            <div>
              <label>LP Token Display Name</label>
              <input
                type='text'
                value={`${storedData.data.firstToken}${storedData.data.secondToken}`}
                readOnly
                className='w-full p-3 rounded-lg bg-gray-100'
              />
            </div>
            <div>
              <label>LP Token Ticker</label>
              <input
                type='text'
                value={`${storedData.data.firstToken}${storedData.data.secondToken}LP`}
                readOnly
                className='w-full p-3 rounded-lg bg-gray-100'
              />
            </div>
            <button
              className='w-full rounded-lg bg-orange-600 hover:bg-orange-700 px-4 py-3 text-white text-base'
              onClick={handleIssueLpToken}
              disabled={transactionPending}
            >
              {transactionPending ? 'Processing...' : 'Issue LP Token'}
            </button>
          </div>
        )}

        {currentStep === '3_setRoles' && (
          <button
            className='w-full rounded-lg bg-purple-600 hover:bg-purple-700 px-4 py-3 text-white text-base'
            onClick={handleSetLocalRoles}
            disabled={transactionPending}
          >
            {transactionPending ? 'Processing...' : 'Set Roles'}
          </button>
        )}

        {currentStep === '4_addLiquidity' && (
          <button
            className='w-full rounded-lg bg-teal-600 hover:bg-teal-700 px-4 py-3 text-white text-base'
            onClick={handleAddInitialLiquidity}
            disabled={transactionPending}
          >
            {transactionPending ? 'Processing...' : 'Add Initial Liquidity'}
          </button>
        )}

        {currentStep === '5_enableSwap' && (
          <button
            className='w-full rounded-lg bg-red-600 hover:bg-red-700 px-4 py-3 text-white text-base'
            onClick={handleEnableSwap}
            disabled={transactionPending}
          >
            {transactionPending ? 'Processing...' : 'Enable Swap'}
          </button>
        )}
      </div>
    </div>
  );
};

export { CreatePool };
