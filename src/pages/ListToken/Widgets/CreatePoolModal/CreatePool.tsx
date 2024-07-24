import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import BigNumber from 'bignumber.js';
import { useGetAccountInfo, sendTransactions } from 'lib';

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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


export const CreatePoolModal: React.FC<CreatePoolModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    ticker: '',
    mintAmount: '',
    decimals: '18',
    freezable: false,
    pauseable: false,
    changeableOwner: false,
    wipeable: false,
    upgradeable: false,
    canAddSpecialRoles: false
  });

  const [errors, setErrors] = useState({
    name: false,
    ticker: false,
    mintAmount: false,
    decimals: false
  });

  const resetForm = () => {
    setFormData({
      name: '',
      ticker: '',
      mintAmount: '',
      decimals: '18',
      freezable: false,
      pauseable: false,
      changeableOwner: false,
      wipeable: false,
      upgradeable: false,
      canAddSpecialRoles: false
    });
    setErrors({
      name: false,
      ticker: false,
      mintAmount: false,
      decimals: false
    });
  };

  const [transactionStatus, setTransactionStatus] = useState('');
  const { account } = useGetAccountInfo();
  const receiver = 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const upperCaseValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setFormData({
      ...formData,
      ticker: upperCaseValue
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      name: !formData.name,
      ticker: !formData.ticker,
      mintAmount: !formData.mintAmount,
      decimals: !formData.decimals
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    const data = generateDataString(formData);

    const transaction = {
      nonce: account.nonce,
      sender: account.address,
      receiver,
      value: '50000000000000000', 
      data,
      gasLimit: 65000000,
      chainID: '55'
    };

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
      resetForm();
    }
  };

  useEffect(() => {
    if (transactionStatus === 'success' || transactionStatus === 'failed') {
      resetForm();
      setTransactionStatus('');
    }
  }, [transactionStatus]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-xl'>Issue Token (Beta)</h2>
          <button onClick={onClose} className='text-gray-400'>
            <FontAwesomeIcon icon={faTimes} size='lg' />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='mb-5'>
            <label className='block text-xs mb-1' htmlFor='name'>
              Name
            </label>
            <input
              type='text'
              name='name'
              id='name'
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 rounded-xl ${errors.name ? 'bg-red-100 border border-red-500' : 'bg-gray-100'}`}
            />
            {errors.name && <span className='text-red-500 text-xs'>Required</span>}
          </div>
          <div className='mb-5'>
            <label className='block text-xs mb-1' htmlFor='ticker'>
              Ticker
            </label>
            <input
              type='text'
              name='ticker'
              id='ticker'
              value={formData.ticker}
              onChange={handleTickerChange}
              className={`w-full p-2 rounded-xl ${errors.ticker ? 'bg-red-100 border border-red-500' : 'bg-gray-100'}`}
            />
            {errors.ticker && <span className='text-red-500 text-xs'>Required</span>}
          </div>
          <div className='mb-5'>
            <label className='block text-xs mb-1' htmlFor='mintAmount'>
              Mint Amount
            </label>
            <input
              type='text'
              name='mintAmount'
              id='mintAmount'
              value={formData.mintAmount}
              onChange={handleChange}
              className={`w-full p-2 rounded-xl ${errors.mintAmount ? 'bg-red-100 border border-red-500' : 'bg-gray-100'}`}
            />
            {errors.mintAmount && <span className='text-red-500 text-xs'>Required</span>}
          </div>
          <div className='mb-6'>
            <label className='block text-xs mb-1' htmlFor='decimals'>
              Decimals
            </label>
            <input
              type='number'
              name='decimals'
              id='decimals'
              value={formData.decimals}
              onChange={handleChange}
              className={`w-full p-2 rounded-xl ${errors.decimals ? 'bg-red-100 border border-red-500' : 'bg-gray-100'}`}
            />
            {errors.decimals && <span className='text-red-500 text-xs'>Required</span>}
          </div>
          <div className='grid grid-cols-2 gap-7 my-8'>
            <div className='flex items-center justify-between'>
              <label className='text-xs'>Freezable</label>
              <Toggle
                defaultChecked={formData.freezable}
                onChange={handleChange}
                name='freezable'
              />
            </div>
            <div className='flex items-center justify-between'>
              <label className='text-xs'>Pauseable</label>
              <Toggle
                defaultChecked={formData.pauseable}
                onChange={handleChange}
                name='pauseable'
              />
            </div>
            <div className='flex items-center justify-between'>
              <label className='text-xs'>Changeable Owner</label>
              <Toggle
                defaultChecked={formData.changeableOwner}
                onChange={handleChange}
                name='changeableOwner'
              />
            </div>
            <div className='flex items-center justify-between'>
              <label className='text-xs'>Wipeable</label>
              <Toggle
                defaultChecked={formData.wipeable}
                onChange={handleChange}
                name='wipeable'
              />
            </div>
            <div className='flex items-center justify-between'>
              <label className='text-xs'>Upgradeable</label>
              <Toggle
                defaultChecked={formData.upgradeable}
                onChange={handleChange}
                name='upgradeable'
              />
            </div>
            <div className='flex items-center justify-between'>
              <label className='text-xs'>Can Add Special Roles</label>
              <Toggle
                defaultChecked={formData.canAddSpecialRoles}
                onChange={handleChange}
                name='canAddSpecialRoles'
              />
            </div>
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg'
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};
