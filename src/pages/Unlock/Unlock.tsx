import React, { useState } from 'react';
import {
  ExtensionLoginButton,
  LedgerLoginButton,
  OperaWalletLoginButton,
  WalletConnectLoginButton,
} from 'components/sdkDapp.components';
import { nativeAuth } from 'config';
import { DataTestIdsEnum } from 'localConstants';
import { routeNames } from 'routes';
import {
  LedgerLoginButtonPropsType,
  OperaWalletLoginButtonPropsType,
  WalletConnectLoginButtonPropsType
} from 'types';
import { AuthRedirectWrapper } from 'wrappers';
import { Keystore, Pem } from './components';
import { useUnlockRedirect } from './hooks';
import { CreateWallet } from '../CreateWallet';

type CommonPropsType =
  | OperaWalletLoginButtonPropsType
  | LedgerLoginButtonPropsType
  | WalletConnectLoginButtonPropsType;

export const Unlock = () => {
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const onUnlockRedirect = useUnlockRedirect();

  const commonProps: CommonPropsType = {
    callbackRoute: routeNames.dashboard,
    nativeAuth,
    onLoginRedirect: () => onUnlockRedirect()
  };

  return (
    <AuthRedirectWrapper requireAuth={false}>
      <div className='flex justify-center items-center'>
        <div
          className='flex flex-col p-6 items-center justify-center gap-4 rounded-xl bg-[#f6f8fa]'
          data-testid={DataTestIdsEnum.unlockPage}
        >
          <div className='flex flex-col items-center gap-1'>
            <h2 className='text-2xl'>Login</h2>

            <p className='text-center text-gray-400'>Choose a login method</p>
          </div>

          <div className='flex flex-col md:flex-row pb-5'>
            <WalletConnectLoginButton
              loginButtonText='xPortal App'
              {...commonProps}
            />
            <LedgerLoginButton loginButtonText='Ledger' {...commonProps} />
            <ExtensionLoginButton
              loginButtonText='DeFi Wallet'
              {...commonProps}
            />
            <OperaWalletLoginButton
              loginButtonText='Opera Crypto Wallet - Beta'
              {...commonProps}
            />

            <Pem />
            <Keystore />
          </div>

          <div className='flex flex-col items-center gap-1 pt-5'>
            <h2 className='text-2xl'>Create Wallet</h2>
            <p className='text-center text-gray-400'>Create your non-custodial wallet</p>
          </div>

          <div className='flex flex-col md:flex-row'>
            <button 
              className='w-full bg-blue-500 text-white py-3 rounded-md text-base'
              onClick={() => setShowCreateWallet(true)}
            >
              Create Wallet
            </button>
          </div>

          {showCreateWallet && (
            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
              <div className='bg-white p-4 rounded shadow-md relative'>
                <button 
                  className='absolute top-0 right-0 m-4 text-black'
                  onClick={() => setShowCreateWallet(false)}
                >
                  X
                </button>
                <CreateWallet />
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthRedirectWrapper>
  );
};

export default Unlock;
