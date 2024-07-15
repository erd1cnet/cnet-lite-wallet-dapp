import React, { useEffect, useState } from 'react';
import { useWrapForm } from './useWrapForm'; // Adjust the import path accordingly

interface WrapProps {
  onClose: () => void;
  balance: number;
}

export const Wrap: React.FC<WrapProps> = ({ onClose, balance }) => {
  const formik = useWrapForm(balance, onClose);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const newAmount = (balance * (formik.values.sliderValue / 100)).toFixed(2);
    if (formik.values.amount !== newAmount) {
      formik.setFieldValue('amount', newAmount);
    }
  }, [formik.values.sliderValue, balance, formik]);

  const handleMaxClick = () => {
    formik.setFieldValue('amount', balance.toFixed(2).toString());
    formik.setFieldValue('sliderValue', 100);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Number(formik.values.amount) === 0) {
      setErrorMessage('Amount must be greater than 0');
    } else {
      setErrorMessage('');
      await formik.handleSubmit(e);
    }
  };

  return (
    <div className='flex flex-col p-4 text-black'>
      <h2 className='text-2xl font-bold p-2 text-center'>Wrap xCNET</h2>
      <div className='text-sm border border-gray-200 mt-5 rounded-xl p-6'>
        <form onSubmit={handleSubmit}>
          <div className='mb-10'>
            <div className='flex justify-between items-center mb-1 mx-1'>
              <span className='text-xs'>Amount:</span>
              <span className='text-xs'>Balance: {balance.toFixed(4)} xCNET</span>
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
                name="amount"
              />
              {formik.touched.amount && formik.errors.amount ? (
                <div className='text-red-600 text-sm'>{formik.errors.amount}</div>
              ) : null}

              <button
                type="button"
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
              Wrap
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
