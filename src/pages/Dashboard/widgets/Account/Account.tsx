import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import QRCode from 'react-qr-code';
import { Copy } from 'components';
import { FormatAmount } from 'components/sdkDapp.components';
import { useGetAccountInfo, useGetNetworkConfig } from 'lib';
import { DataTestIdsEnum } from 'localConstants';
import {
  explorerAddressSelector,
  useSdkDappSelector
} from 'redux/sdkDapp.store';

export const Account = () => {
  const { network } = useGetNetworkConfig();
  const { address, account } = useGetAccountInfo();
  const explorerAddress = useSdkDappSelector(explorerAddressSelector);
  console.log(explorerAddress);

  return (
    <div className='rounded-xl bg-gray-950 p-6 text-white sm:text-left'>
      <div className='flex flex-col gap-6 sm:flex-row pb-4'>
        <div className='flex grow flex-col gap-4 overflow-hidden'>
          <div className='overflow-hidden text-ellipsis text-xl font-medium xs:text-2xl'>
            Account
          </div>
          <div>
            <div className='text-sm text-gray-400'>Your address:</div>
            <div
              className='overflow-hidden break-all text-sm'
              data-testid={DataTestIdsEnum.userAddress}
            >
              {address}
              <Copy value={address} />
            </div>
          </div>
          <div className='my-1 flex justify-center sm:hidden'>
            <QRCode
              className='rounded-lg border-8 border-white bg-white'
              value={address ?? ''}
              size={200}
              fgColor='#030712'
            />
          </div>
          <div>
            <div className='text-sm text-gray-400 sm:text-left text-center'>
              Your balance:
            </div>
            <div className='flex items-center justify-center sm:justify-start'>
              <div className='flex items-center justify-start gap-2 '>
                <span className='text-xl'>
                  <FormatAmount
                    value={account.balance}
                    egldLabel={network.egldLabel}
                    data-testid='balance'
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='mb-2 hidden justify-center sm:block'>
          <QRCode
            className='rounded-lg border-8 border-white bg-white'
            value={address ?? ''}
            size={120}
            fgColor='#030712'
          />
        </div>
      </div>
      <div className='flex flex-wrap gap-2 sm:justify-start justify-center'>
        <a
          href={`${explorerAddress}/accounts/${address}`}
          target='_blank'
          className='flex items-center rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white'
        >
          Open in Explorer{' '}
          <FontAwesomeIcon className='pl-2' icon={faExternalLink} />
        </a>
      </div>
    </div>
  );
};
