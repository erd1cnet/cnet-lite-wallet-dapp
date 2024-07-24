import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useUnwrapForm } from './useUnwrapForm'; // Adjust the import path accordingly

interface UnwrapProps {
  onClose: () => void;
  balance: number;
}

export const Unwrap: React.FC<UnwrapProps> = ({ onClose, balance }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const formik = useUnwrapForm(balance, onClose);

  const convertedBalance = new BigNumber(balance).dividedBy(1e18); // Assuming the balance is in wei and we need to convert to ether

  useEffect(() => {
    const newAmount = convertedBalance
      .multipliedBy(formik.values.sliderValue)
      .dividedBy(100)
      .toFixed(2);
    if (formik.values.amount !== newAmount) {
      formik.setFieldValue('amount', newAmount);
    }
  }, [formik.values.sliderValue, convertedBalance, formik]);

  const handleMaxClick = () => {
    formik.setFieldValue('amount', convertedBalance.toFixed(2));
    formik.setFieldValue('sliderValue', 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new BigNumber(formik.values.amount).isZero()) {
      setErrorMessage('Amount must be greater than 0');
      return;
    }
    setErrorMessage('');
    await formik.handleSubmit();
  };

  return (
    <div className='flex flex-col p-4 text-black'>
      <h2 className='text-2xl font-bold p-2 text-center'>Unwrap WCNET</h2>
      <div className='text-sm border border-gray-200 mt-5 rounded-xl p-6'>
        <form onSubmit={handleSubmit}>
          <div className='mb-10'>
            <div className='flex justify-between items-center mb-1 mx-1'>
              <span className='text-xs'>Amount:</span>
              <span className='text-xs'>
                Balance: {convertedBalance.toFixed(2)} WCNET
              </span>
            </div>
            <div className='flex items-center p-3 rounded-xl bg-gray-100'>
              <input
                type='number'
                placeholder='Amount'
                value={formik.values.amount}
                onChange={formik.handleChange}
                className='bg-transparent pl-3 text-black flex-grow outline-none no-arrows'
                style={{ minWidth: '0' }}
                onBlur={formik.handleBlur}
                name='amount'
              />
              {formik.touched.amount && formik.errors.amount ? (
                <div className='text-red-600 text-sm'>
                  {formik.errors.amount}
                </div>
              ) : null}

              <button
                type='button'
                className='bg-blue-500 text-white text-xs px-3 py-1 rounded-full ml-2'
                onClick={handleMaxClick}
              >
                MAX
              </button>
            </div>
          </div>
          <div className='flex items-center mb-10'>
            <span className='mr-2'>0%</span>
            <input
              type='range'
              min='0'
              max='100'
              name='sliderValue'
              value={formik.values.sliderValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='w-full mx-2'
            />
            <span className='ml-2'>100%</span>
          </div>
          <div className='flex justify-between items-center'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-300 rounded-lg p-2 w-1/2 mr-2'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white rounded-lg p-2 w-1/2 ml-2'
            >
              Unwrap
            </button>
          </div>
          {errorMessage && (
            <div className='text-red-600 text-sm mt-2 text-center'>
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
