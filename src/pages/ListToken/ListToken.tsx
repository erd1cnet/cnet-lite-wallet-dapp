import { useEffect } from 'react';
import {
  faWaterLadder,
  faArrowRightArrowLeft,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { MxLink } from 'components';
import { useGetIsLoggedIn } from 'lib';
import { DataTestIdsEnum } from 'localConstants';
import { routeNames } from 'routes';

const ListTokenForm = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(routeNames.unlock);
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className='flex flex-col p-6 max-w-2xl w-full bg-white shadow-md rounded h-full'>
      <h2 className='text-2xl font-bold p-2 text-center'>List Token</h2>
      <p className='text-gray-400 text-center mb-8'>
        3 steps to list your token
      </p>
      <div className='mt-4 flex flex-col align-middle space-y-4'>
        <button
          className='transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white py-12 rounded-3xl flex items-center justify-center'
          onClick={() => navigate('/list-token/create')}
        >
          <div className='text-center'>
            <FontAwesomeIcon
              icon={faWaterLadder}
              className='h-12 w-12 mx-auto mb-4'
            />
            <div className='flex flex-col gap-2 text-center'>
              <h3 className='text-2xl'>Create Pool</h3>
              <span className='text-gray-300'>
                Create pools using the tokens you minted.
              </span>
            </div>
          </div>
        </button>
        <button className='transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white py-12 rounded-3xl flex items-center justify-center'>
          <div className='text-center'>
            <FontAwesomeIcon
              icon={faArrowRightArrowLeft}
              className='h-12 w-12 mx-auto mb-4'
            />
            <div className='flex flex-col gap-2 text-center'>
              <h3 className='text-2xl'>Enable Trade</h3>
              <p className='text-gray-300'>Enable trade for your pools.</p>
            </div>
          </div>
        </button>
        <button className='transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white py-12 rounded-3xl flex items-center justify-center'>
          <div className='text-center'>
            <FontAwesomeIcon icon={faLock} className='h-12 w-12 mx-auto mb-4' />
            <div className='flex flex-col gap-2 text-center'>
              <h3 className='text-2xl'>Lock LP</h3>
              <p className='text-gray-300'>Lock liquidity pool token.</p>
            </div>
          </div>
        </button>
        <MxLink
          className='block w-full mt-2 px-4 py-2 text-sm text-center text-blue-600'
          data-testid={DataTestIdsEnum.cancelBtn}
          to={routeNames.dashboard}
        >
          « Back
        </MxLink>
      </div>
    </div>
  );
};

export const ListToken = () => {
  return <ListTokenForm />;
};
