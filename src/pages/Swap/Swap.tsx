import { useState, useEffect, useRef } from 'react';
import { MxLink } from 'components';
import { DataTestIdsEnum } from 'localConstants';
import { routeNames } from 'routes';
import CnetLogo from '../../assets/img/cnet-logo.svg';

export const Swap = () => {
  const [selectedFromToken, setSelectedFromToken] = useState('CNET');
  const [selectedToToken, setSelectedToToken] = useState('Select...');
  const [dropdownOpenFrom, setDropdownOpenFrom] = useState(false);
  const [dropdownOpenTo, setDropdownOpenTo] = useState(false);

  const tokens = [
    { name: 'CNET', logo: CnetLogo },
    { name: 'Token1', logo: CnetLogo },
    { name: 'Token2', logo: CnetLogo },
    { name: 'Token3', logo: CnetLogo }
  ];

  const dropdownFromRef = useRef<HTMLDivElement>(null);
  const dropdownToRef = useRef<HTMLDivElement>(null);

  const handleTokenSelectFrom = (token: { name: any; logo?: string }) => {
    setSelectedFromToken(token.name);
    setDropdownOpenFrom(false);
  };

  const handleTokenSelectTo = (token: { name: any; logo?: string }) => {
    setSelectedToToken(token.name);
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

  return (
    <div className='flex flex-col p-6 max-w-2xl w-full bg-white shadow-md rounded h-full'>
      <div className='flex flex-col gap-6'>
        <h2 className='text-2xl font-bold p-2 mb-2 text-center'>Swap</h2>

        <div className='text-sm border border-gray-200 rounded-xl p-6 max-w-md mx-auto'>
          <div className='mb-6'>
            <div className='flex justify-between items-center mb-1 mx-1'>
              <span className='text-xs'>Swap From:</span>
              <span className='text-xs'>Balance: 0 {selectedFromToken}</span>
            </div>
            <div className='flex items-center p-3 rounded-xl bg-gray-100'>
              <input
                type='number'
                placeholder='Amount'
                className='bg-transparent pl-3 text-black flex-grow outline-none no-arrows'
                style={{ minWidth: '0' }}
              />
              <button className='bg-blue-500 text-white text-xs px-3 py-1 rounded-full ml-2'>
                MAX
              </button>
              <div
                className='ml-2 p-2 relative bg-white rounded-l-full'
                style={{ flexShrink: 0 }}
                ref={dropdownFromRef}
                onClick={() => setDropdownOpenFrom(!dropdownOpenFrom)}
              >
                <button className='flex items-center'>
                  <img src={CnetLogo} alt='CNET' className='w-6 h-6 mr-2' />
                  <span>{selectedFromToken}</span>
                </button>
                {dropdownOpenFrom && (
                  <div className='absolute mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                    {tokens.map((token) => (
                      <button
                        key={token.name}
                        className='flex items-center w-full px-4 py-2 text-left hover:bg-gray-100'
                        onClick={() => handleTokenSelectFrom(token)}
                      >
                        <img
                          src={token.logo}
                          alt={token.name}
                          className='w-6 h-6 mr-2'
                        />
                        <span>{token.name}</span>
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
              <span className='text-xs'>Balance: 0 {selectedToToken}</span>
            </div>
            <div className='flex items-center p-3 rounded-xl bg-gray-100'>
              <input
                type='number'
                placeholder='Amount'
                className='bg-transparent pl-3 text-black flex-grow outline-none no-arrows'
                style={{ minWidth: '0' }}
              />
              {selectedToToken !== 'Select...' && (
                <button className='bg-blue-500 text-white text-xs px-3 py-1 rounded-full ml-2'>
                  MAX
                </button>
              )}
              <div
                className='ml-2 p-2 relative bg-white rounded-l-full'
                style={{ flexShrink: 0 }}
                ref={dropdownToRef}
                onClick={() => setDropdownOpenTo(!dropdownOpenTo)}
              >
                <button className='flex items-center'>
                  {selectedToToken === 'Select...' ? (
                    <span className='text-gray-500'>{selectedToToken}</span>
                  ) : (
                    <>
                      <img src={CnetLogo} alt='CNET' className='w-6 h-6 mr-2' />
                      <span>{selectedToToken}</span>
                    </>
                  )}
                </button>
                {dropdownOpenTo && (
                  <div className='absolute mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                    {tokens.map((token) => (
                      <button
                        key={token.name}
                        className='flex items-center w-full px-4 py-2 text-left hover:bg-gray-100'
                        onClick={() => handleTokenSelectTo(token)}
                      >
                        <img
                          src={token.logo}
                          alt={token.name}
                          className='w-6 h-6 mr-2'
                        />
                        <span>{token.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button className='w-full bg-blue-500 text-white py-3 rounded-md text-base'>
            Swap
          </button>
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