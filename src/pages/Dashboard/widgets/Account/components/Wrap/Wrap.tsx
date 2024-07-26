import React, { useEffect, useState } from 'react';
import { useWrapForm } from './useWrapForm'; // Adjust the import path accordingly
import './Wrap.css'; // Adjust the import path accordingly

interface WrapProps {
  onClose: () => void;
  balance: number;
}

export const Wrap: React.FC<WrapProps> = ({ onClose, balance }) => {
  const formik = useWrapForm(balance, onClose);
  const [isSliderChanging, setIsSliderChanging] = useState<boolean>(false);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState<number>(0);

  useEffect(() => {
    if (isSliderChanging) {
      let newAmount = balance * (formik.values.sliderValue / 100);
      if (formik.values.sliderValue === 100) {
        newAmount -= 0.1;
      }
      formik.setFieldValue('amount', newAmount.toFixed(2));
      setIsSliderChanging(false);
    }
  }, [formik.values.sliderValue, balance, isSliderChanging]);

  const handleMaxClick = () => {
    const maxAmount = (parseFloat(balance.toFixed(2)) - 0.1).toFixed(2);
    formik.setFieldValue('amount', maxAmount);
    formik.setFieldValue('sliderValue', 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value))) {
      formik.setFieldValue('amount', value);
      const percentage = (Number(value) / balance) * 100;
      formik.setFieldValue('sliderValue', percentage);

      if (Number(value) > balance) {
        formik.setFieldError('amount', 'The amount cannot be greater than the balance.');
      } else {
        formik.setFieldError('amount', '');
      }
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSliderValue = Number(e.target.value);
    formik.setFieldValue('sliderValue', newSliderValue);
    setIsSliderChanging(true);
  };

  const handleSliderMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / slider.offsetWidth) * 100;
    setTooltipPosition(position);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await formik.handleSubmit(e);
  };

  return (
    <div className='flex flex-col p-4 text-black'>
      <h2 className='text-2xl font-bold p-2 text-center'>Wrap xCNET</h2>
      <div className='text-sm border border-gray-200 mt-5 rounded-xl p-6'>
        <form onSubmit={handleSubmit}>
          <div className='mb-10'>
            <div className='flex justify-between items-center mb-1 mx-1'>
              <span className='text-xs'>Amount:</span>
              <span className='text-xs'>
                Balance: {(Math.floor(balance * 100) / 100).toFixed(2)} xCNET
              </span>
            </div>
            <div className='flex items-center p-3 rounded-xl bg-gray-100'>
              <input
                type='number'
                placeholder='Amount'
                value={formik.values.amount}
                onChange={handleInputChange}
                className='bg-transparent pl-3 text-black flex-grow outline-none no-arrows'
                style={{ minWidth: '0' }}
                name='amount'
                step='0.01'
                min='0'
              />
              {formik.errors.amount && (
                <div className='text-red-600 text-sm'>
                  {formik.errors.amount}
                </div>
              )}
              <button
                type='button'
                className='bg-blue-500 text-white text-xs px-3 py-1 rounded-full ml-2'
                onClick={handleMaxClick}
              >
                MAX
              </button>
            </div>
          </div>
          <div className='slider-container'>
            <input
              type='range'
              min='0'
              max='100'
              step={1}
              value={formik.values.sliderValue}
              onChange={handleSliderChange}
              onMouseMove={handleSliderMouseMove}
              onMouseDown={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
              onMouseUp={() => setTooltipVisible(false)}
              className='slider'
              style={{ '--value': `${formik.values.sliderValue}%` } as React.CSSProperties}
            />
            {tooltipVisible && (
              <div
                className='tooltip'
                style={{ left: `${tooltipPosition}%` }}
              >
                {formik.values.sliderValue}%
              </div>
            )}
            <div className="slider-marks">
              <span className={formik.values.sliderValue >= 0 ? 'active' : ''}></span>
              <span className={formik.values.sliderValue >= 25 ? 'active' : ''}></span>
              <span className={formik.values.sliderValue >= 50 ? 'active' : ''}></span>
              <span className={formik.values.sliderValue >= 75 ? 'active' : ''}></span>
              <span className={formik.values.sliderValue >= 100 ? 'active' : ''}></span>
            </div>
          </div>
          <div className="flex justify-between mb-7 text-xs text-gray-600">
            <span className="w-8 text-left">0%</span>
            <span className="w-8 text-center">25%</span>
            <span className="w-8 text-center">50%</span>
            <span className="w-8 text-center">75%</span>
            <span className="w-8 text-right">100%</span>
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
              disabled={Number(formik.values.amount) > balance}
            >
              Wrap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
