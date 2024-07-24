import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import BigNumber from 'bignumber.js';
import { useGetAccountInfo, sendTransactions } from 'lib';

interface IssueTokenModalProps {
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

const generateDataString = (formData: any) => {
  let data = `issue@${stringToHex(formData.name)}@${stringToHex(formData.ticker)}@${toHex(
    new BigNumber(formData.mintAmount).times(new BigNumber(10).pow(formData.decimals))
  )}@${toHex(formData.decimals)}`;

  data += `@${stringToHex('canFreeze')}@${stringToHex(formData.freezable ? 'true' : 'false')}`;
  data += `@${stringToHex('canPause')}@${stringToHex(formData.pauseable ? 'true' : 'false')}`;
  data += `@${stringToHex('canChangeOwner')}@${stringToHex(formData.changeableOwner ? 'true' : 'false')}`;
  data += `@${stringToHex('canWipe')}@${stringToHex(formData.wipeable ? 'true' : 'false')}`;
  data += `@${stringToHex('canUpgrade')}@${stringToHex(formData.upgradeable ? 'true' : 'false')}`;
  data += `@${stringToHex('canAddSpecialRoles')}@${stringToHex(formData.canAddSpecialRoles ? 'true' : 'false')}`;

  return data;
};


export const IssueTokenModal: React.FC<IssueTokenModalProps> = ({ isOpen, onClose }) => {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
      <div className='bg-black p-6 rounded-lg shadow-lg max-w-sm w-full'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl text-white'>Issue Token (Beta)</h2>
          <button onClick={onClose} className='text-gray-400'>
            <FontAwesomeIcon icon={faTimes} size='lg' />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-400 text-sm mb-1' htmlFor='name'>
              Name
            </label>
            <input
              type='text'
              name='name'
              id='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full p-2 bg-gray-800 text-white rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-400 text-sm mb-1' htmlFor='ticker'>
              Ticker
            </label>
            <input
              type='text'
              name='ticker'
              id='ticker'
              value={formData.ticker}
              onChange={handleChange}
              className='w-full p-2 bg-gray-800 text-white rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-400 text-sm mb-1' htmlFor='mintAmount'>
              Mint Amount
            </label>
            <input
              type='text'
              name='mintAmount'
              id='mintAmount'
              value={formData.mintAmount}
              onChange={handleChange}
              className='w-full p-2 bg-gray-800 text-white rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-400 text-sm mb-1' htmlFor='decimals'>
              Decimals
            </label>
            <input
              type='text'
              name='decimals'
              id='decimals'
              value={formData.decimals}
              onChange={handleChange}
              className='w-full p-2 bg-gray-800 text-white rounded'
            />
          </div>
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='block text-gray-400 text-sm mb-1'>Freezable</label>
              <Toggle
                defaultChecked={formData.freezable}
                onChange={handleChange}
                name='freezable'
              />
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-1'>Pauseable</label>
              <Toggle
                defaultChecked={formData.pauseable}
                onChange={handleChange}
                name='pauseable'
              />
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-1'>Changeable Owner</label>
              <Toggle
                defaultChecked={formData.changeableOwner}
                onChange={handleChange}
                name='changeableOwner'
              />
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-1'>Wipeable</label>
              <Toggle
                defaultChecked={formData.wipeable}
                onChange={handleChange}
                name='wipeable'
              />
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-1'>Upgradeable</label>
              <Toggle
                defaultChecked={formData.upgradeable}
                onChange={handleChange}
                name='upgradeable'
              />
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-1'>Can Add Special Roles</label>
              <Toggle
                defaultChecked={formData.canAddSpecialRoles}
                onChange={handleChange}
                name='canAddSpecialRoles'
              />
            </div>
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded'
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};
