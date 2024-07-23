import React, { useState, ChangeEvent, FormEvent } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useScrollToElement } from 'hooks';
import { WidgetType } from 'types/widget.types';
import { AuthRedirectWrapper } from 'wrappers';
import { Widget } from './components';
import { Account, NFTs, Tokens, Transactions } from './widgets';

interface IssueTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IssueTokenModal: React.FC<IssueTokenModalProps> = ({
  isOpen,
  onClose
}) => {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic
    console.log(formData);
  };

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
            <label
              className='block text-gray-400 text-sm mb-1'
              htmlFor='ticker'
            >
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
            <label
              className='block text-gray-400 text-sm mb-1'
              htmlFor='mintAmount'
            >
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
            <label
              className='block text-gray-400 text-sm mb-1'
              htmlFor='decimals'
            >
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
              <label className='block text-gray-400 text-sm mb-1'>
                Freezable
              </label>
              <input
                type='checkbox'
                name='freezable'
                checked={formData.freezable}
                onChange={handleChange}
                className='h-4 w-4'
              />
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-1'>
                Pauseable
              </label>
              <input
                type='checkbox'
                name='pauseable'
                checked={formData.pauseable}
                onChange={handleChange}
                className='h-4 w-4'
              />
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-1'>
                Changeable Owner
              </label>
              <input
                type='checkbox'
                name='changeableOwner'
                checked={formData.changeableOwner}
                onChange={handleChange}
                className='h-4 w-4'
              />
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-1'>
                Wipeable
              </label>
              <input
                type='checkbox'
                name='wipeable'
                checked={formData.wipeable}
                onChange={handleChange}
                className='h-4 w-4'
              />
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-1'>
                Upgradeable
              </label>
              <input
                type='checkbox'
                name='upgradeable'
                checked={formData.upgradeable}
                onChange={handleChange}
                className='h-4 w-4'
              />
            </div>
            <div>
              <label className='block text-gray-400 text-sm mb-1'>
                Can Add Special Roles
              </label>
              <input
                type='checkbox'
                name='canAddSpecialRoles'
                checked={formData.canAddSpecialRoles}
                onChange={handleChange}
                className='h-4 w-4'
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

export const Dashboard = () => {
  useScrollToElement();

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state management

  const WIDGETS: WidgetType[] = [
    {
      title: 'Tokens',
      widget: Tokens,
      description: 'Tokens for the connected account',
      reference:
        'https://testnet-api.cyber.network/#/accounts/AccountController_getAccountTokens',
      button: (
        <button
          className='text-xs text-white rounded bg-blue-600 hover:bg-blue-700 px-2 py-1'
          onClick={() => setIsModalOpen(true)}
        >
          Issue Token (Beta)
        </button>
      )
    },
    {
      title: 'NFTs',
      widget: NFTs,
      description: 'NFTs for the connected account',
      reference:
        'https://testnet-api.cyber.network/#/accounts/AccountController_getAccountNfts'
    },
    {
      title: 'Transactions',
      widget: Transactions,
      description: 'Transactions list for the connected account',
      reference:
        'https://testnet-api.cyber.network/#/accounts/AccountController_getAccountTransactions'
    }
  ];

  return (
    <AuthRedirectWrapper>
      <div className='flex flex-col gap-6 max-w-2xl w-full'>
        <Account />
        {WIDGETS.map((element) => (
          <Widget key={element.title} {...element} button={element.button} />
        ))}
      </div>
      <IssueTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />{' '}
      {/* Render modal */}
    </AuthRedirectWrapper>
  );
};
