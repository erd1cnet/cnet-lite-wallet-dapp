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
    <div className='flex flex-col p-4'>
      <h2 className='text-2xl text-black font-bold p-2 text-center'>Wrap xCNET</h2>
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
              <span className='text-gray-600'>Balance: {balance.toFixed(4)} xCNET</span>
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
    </div>
  );
};
