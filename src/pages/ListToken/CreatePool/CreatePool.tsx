import { useState } from 'react';
import {
  faSwimmingPool,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { routeNames } from 'routes';
import ProgressBar from './ProgressBar';

const CreatePool = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Handle form submission or completion
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(routeNames.listToken);
    }
  };

  const getTitle = () => {
    switch (step) {
      case 1:
        return 'Generate Pool Address';
      case 2:
        return 'Create LP Token';
      case 3:
        return 'Set LP Token Roles';
      case 4:
        return 'Add Initial Liquidity';
      case 5:
        return 'Liquidity pool successfully created!';
      default:
        return '';
    }
  };

  return (
    <div className='flex flex-col p-6 max-w-2xl w-full bg-white shadow-md rounded h-full items-center'>
      <h2 className='text-2xl font-bold p-2'>Create Pool</h2>
      <p className='text-gray-400 mb-8'>
        Create pools using the tokens you minted.
      </p>
      <div className='p-6 rounded-lg border border-gray-200 shadow-xl w-full max-w-md'>
        <h3 className='text-xl font-semibold mb-4 text-center'>{getTitle()}</h3>
        {step < 5 && <ProgressBar step={step} />}
        {step === 1 && (
          <>
            <p className='text-gray-400 text-center mb-4'>
              You must be the creator of the tokens and also brand them.
              Branding details can be found{' '}
              <a href='#' className='text-blue-500'>
                here
              </a>
              .
            </p>
            <div className='space-y-4'>
              <select className='w-full flex items-center p-3 rounded-xl bg-gray-100'>
                <option value=''>ARWEN-4f5052</option>
              </select>
              <div className='flex justify-center mb-2'>
                <span className='text-2xl'>+</span>
              </div>
              <select className='w-full flex items-center p-3 rounded-xl bg-gray-100'>
                <option value=''>WCNET</option>
              </select>
              <button className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white text-base'>
                Generate Pool Address
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <div className='space-y-4'>
            <div className='relative'>
              <label className='block text-gray-700'>Pool Address</label>
              <input
                type='text'
                className='w-full p-3 rounded-xl bg-gray-100'
                value='erd1qqq...rt89kh'
                readOnly
              />
              <button className='absolute right-4 top-10 text-gray-500'>
                <i className='fa fa-copy'></i>
              </button>
            </div>
            <div className='relative'>
              <label className='block text-gray-700'>LP Token Name</label>
              <input
                type='text'
                className='w-full p-3 rounded-xl bg-gray-100'
                value='ARWENWCNETLP'
                readOnly
              />
              <button className='absolute right-4 top-10 text-gray-500'>
                <i className='fa fa-copy'></i>
              </button>
            </div>
            <div className='relative'>
              <label className='block text-gray-700'>LP Token Ticker</label>
              <input
                type='text'
                className='w-full p-3 rounded-xl bg-gray-100'
                value='ARWENWCNET'
                readOnly
              />
              <button className='absolute right-4 top-10 text-gray-500'>
                <i className='fa fa-copy'></i>
              </button>
            </div>
            <button className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white text-base'>
              Create LP Token
            </button>
          </div>
        )}
        {step === 3 && (
          <div className='text-center'>
            <FontAwesomeIcon
              icon={faSwimmingPool}
              className='h-24 w-24 mx-auto mb-4'
            />
            <div className='text-gray-600 mb-4'>
              <p>LP Token</p>
              <p className='font-bold'>ARWENWCNET-e5366a</p>
            </div>
            <div className='w-full mb-4 relative'>
              <input
                type='text'
                className='w-full p-3 rounded-xl bg-gray-100 text-center'
                value='erd1qqq...rt89kh'
                readOnly
              />
              <button className='absolute right-4 top-2 text-gray-500'>
                <i className='fa fa-copy'></i>
              </button>
            </div>
            <button className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white text-base'>
              Set LP Token Roles
            </button>
          </div>
        )}
        {step === 4 && (
          <div className='space-y-4'>
            <div className='relative'>
              <label className='block text-gray-700'>Pool Address</label>
              <input
                type='text'
                className='w-full p-3 rounded-xl bg-gray-100'
                value='erd1qqq...rt89kh'
                readOnly
              />
              <button className='absolute right-4 top-10 text-gray-500'>
                <i className='fa fa-copy'></i>
              </button>
            </div>
            <div className='relative'>
              <label className='block text-gray-700'>LP Token Roles</label>
              <input
                type='text'
                className='w-full p-3 rounded-xl bg-gray-100'
                value='LP Token Roles'
                readOnly
              />
              <FontAwesomeIcon
                icon={faCheckCircle}
                className='absolute right-4 top-10 text-green-500'
              />
            </div>
            <div className='relative'>
              <label className='block text-gray-700'>
                ARWEN-4f5052 Initial Liquidity
              </label>
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
                <span className='ml-2 text-gray-500'>balance</span>
              </div>
            </div>
            <div className='relative'>
              <label className='block text-gray-700'>
                WCNET Initial Liquidity
              </label>
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
                <span className='ml-2 text-gray-500'>balance</span>
              </div>
            </div>
            <div className='mt-4'>
              <label className='text-sm text-gray-700'>Exchange Rate:</label>
              <p className='text-gray-500'>1 ARWEN-4f5052 = 0.0025 WCNET</p>
              <p className='text-gray-500'>1 WCNET = 400 ARWEN-4f5052</p>
            </div>
            <div className='text-yellow-600 bg-yellow-100 p-3 rounded-xl mt-4'>
              <p className='font-semibold'>
                You are the first Liquidity Provider
              </p>
              <p className='text-sm'>
                The ratio of tokens you add will set the price of this pool.
                Once you are happy with the rate, continue with adding the
                initial liquidity.
              </p>
            </div>
            <button className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white text-base'>
              Add Initial Liquidity
            </button>
          </div>
        )}
        {step === 5 && (
          <div className='space-y-4 text-center'>
            <div className='flex flex-col items-center'>
              <FontAwesomeIcon
                icon={faCheckCircle}
                className='h-16 w-16 text-green-500 mb-5'
              />
              <div className='border-dashed border-2 px-6 py-2 border-green-500 rounded-2xl'>
                <span>ARWEN-4f5052 / WCNET</span>
              </div>
            </div>
            <div className='relative'>
              <label className='block text-gray-700'>Pool Address</label>
              <input
                type='text'
                className='w-full p-3 rounded-xl bg-gray-100'
                value='erd1qqq...rt89kh'
                readOnly
              />
              <button className='absolute right-4 top-10 text-gray-500'>
                <i className='fa fa-copy'></i>
              </button>
            </div>
            <div className='relative'>
              <label className='block text-gray-700'>Token Identifier</label>
              <input
                type='text'
                className='w-full p-3 rounded-xl bg-gray-100'
                value='ARWEN-4f5052'
                readOnly
              />
              <button className='absolute right-4 top-10 text-gray-500'>
                <i className='fa fa-copy'></i>
              </button>
            </div>
            <div className='flex justify-between mt-4'>
              <button className='bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded'>
                Enable Trade
              </button>
              <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
      {step < 5 && (
        <div className='flex justify-between w-full mt-4'>
          <button className='text-blue-500' onClick={handleBack}>
            « Back
          </button>
          <button
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'
            onClick={handleNext}
          >
            {step < 4 ? 'Next' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  );
};

export { CreatePool };
