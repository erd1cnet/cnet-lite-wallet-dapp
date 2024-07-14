import React, { useEffect, useState } from 'react';
import { useUnwrapForm } from './useUnwrapForm'; // Adjust the import path accordingly
import BigNumber from 'bignumber.js';

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
    <div className='flex flex-col p-4'>
      <h2 className='text-2xl text-black font-bold p-2 text-center'>Unwrap WCNET</h2>
      <div className='flex justify-center'>
        <div className='bg-white p-6 rounded-lg shadow-md w-96'>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col mb-4'>
              <label className='text-black mb-1'>Amount</label>
              <input
                type='text'
                name='amount'
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='border border-gray-300 rounded p-2 w-full text-black'
              />
              {formik.touched.amount && formik.errors.amount ? (
                <div className='text-red-600 text-sm'>{formik.errors.amount}</div>
              ) : null}
            </div>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-gray-600'>
                Balance: {convertedBalance.toFixed(4)} WCNET
              </span>
              <button
                type='button'
                onClick={handleMaxClick}
                className='bg-blue-500 text-white rounded p-2'
              >
                MAX
              </button>
            </div>
            <div className='flex items-center mb-4'>
              <span className='text-black mr-2'>0</span>
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
              <span className='text-black ml-2'>100</span>
            </div>
            <div className='flex justify-between items-center mb-4'>
              <button
                type='button'
                onClick={onClose}
                className='bg-gray-300 text-black rounded p-2 w-1/2 mr-2'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='bg-blue-500 text-white rounded p-2 w-1/2 ml-2'
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
    </div>
  );
};
