import { useState } from 'react';
import { MouseEvent } from 'react';
import {
  faArrowUp,
  faCoins,
  faArrowDown,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { FormatAmount } from 'components';
import { SearchParamsEnum } from 'localConstants';
import { sendRouteBuilder, swapRouteBuilder } from 'routes'; // swapRouteBuilder'ı da import et
import { TokenType } from 'types';
import { Unwrap } from './Unwrap';

export const TokenRow = ({ token }: { token: TokenType }) => {
  const [showUnwrap, setShowUnwrap] = useState(false);

  const navigate = useNavigate();
  const logo = token.assets?.svgUrl;

  const handleSend = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    navigate(
      sendRouteBuilder({
        [SearchParamsEnum.tokenId]: token.identifier
      })
    );
  };

  const handleSwap = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    navigate(
      swapRouteBuilder({
        [SearchParamsEnum.tokenId]: token.identifier
      })
    );
  };

  return (
    <>
      <div className='flex items-center justify-between p-4 rounded-lg border-b border-gray-200'>
        <div className='flex items-center space-x-4'>
          {logo ? (
            <img src={logo} alt={token.ticker} className='w-8 h-8' />
          ) : (
            <FontAwesomeIcon icon={faCoins} className='token-item-logo-coins' />
          )}
          <div>{token.ticker}</div>
        </div>
        <div className='flex items-center space-x-2'>
          {token.balance && (
            <div className='text-right'>
              <FormatAmount value={token.balance} showLabel={false} />
            </div>
          )}
          {token.identifier === 'WCNET-26845d' && (
            <button
              className='text-xs text-white rounded bg-blue-600 hover:bg-blue-700 px-2 py-1'
              data-testid={`unwrap-${token.identifier}`}
              onClick={() => setShowUnwrap(true)}
              title="Unwrap"
            >
              Unwrap
            </button>
          )}
          <button
            className='text-xs text-white rounded bg-red-600 hover:bg-red-700 px-2 py-1'
            data-testid={`send-${token.identifier}-send`}
            onClick={handleSend}
            title="Send"
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
          <button
            className='text-xs text-white rounded bg-green-600 hover:bg-green-700 px-2 py-1'
            data-testid={`send-receive-${token.identifier}`}
            onClick={handleSwap}
            title="Send"
          >
            <FontAwesomeIcon icon={faArrowUp} />{' '}
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
        </div>
      </div>

      {showUnwrap && (
        <div className='fixed inset-0 flex items-center justify-center shadow-lg bg-black bg-opacity-40'>
          <div className='bg-white p-3 rounded-xl shadow-xl relative max-w-screen-sm w-full mx-3'>
            <button
              className='absolute top-0 right-0 m-4 text-black'
              onClick={() => setShowUnwrap(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <Unwrap
              onClose={() => setShowUnwrap(false)}
              balance={token.balance ? Number(token.balance) : 0}
            />
          </div>
        </div>
      )}
    </>
  );
};
