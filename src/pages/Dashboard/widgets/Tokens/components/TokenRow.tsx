import { MouseEvent } from 'react';
import {
  faArrowUp,
  faCoins,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { FormatAmount } from 'components';
import { SearchParamsEnum } from 'localConstants';
import { sendRouteBuilder } from 'routes';
import { TokenType } from 'types';

export const TokenRow = ({ token }: { token: TokenType }) => {
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

  return (
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
        <button
          className='text-white rounded bg-red-600 hover:bg-red-700 px-2 py-1'
          data-testid={`send-${token.identifier}`}
          onClick={handleSend}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <button
          className='text-white rounded bg-blue-600 hover:bg-blue-700 px-2 py-1'
          data-testid={`send-${token.identifier}`}
          onClick={handleSend}
        >
          Unwrap
        </button>
        <button
          className='text-white rounded bg-green-600 hover:bg-green-700 px-2 py-1'
          data-testid={`send-${token.identifier}`}
          onClick={handleSend}
        >
          <FontAwesomeIcon icon={faArrowUp} />{' '}
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </div>
    </div>
  );
};
