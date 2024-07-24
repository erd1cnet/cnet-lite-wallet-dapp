import { useState } from 'react';
import { useScrollToElement } from 'hooks';
import { WidgetType } from 'types/widget.types';
import { AuthRedirectWrapper } from 'wrappers';
import { Widget } from './components';
import {
  Account,
  NFTs,
  Tokens,
  Transactions,
  IssueTokenModal
} from './widgets';

export const Dashboard = () => {
  useScrollToElement();

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      />
    </AuthRedirectWrapper>
  );
};
