import { useEffect } from 'react';
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
      <div className='flex flex-col'>
        <h2 className='text-2xl font-bold p-2 text-center'>DEX Pools</h2>
        <p className='text-gray-400 text-center mb-8'>
          All pools are listed here.
        </p>
        <div className='text-sm border border-gray-200 rounded-xl p-6'>
          <div className='text-sm text-gray-400'>Pools here..</div>
        </div>
        <div className='mt-4 flex flex-col align-middle'>
          <MxLink
            className='block w-full mt-2 px-4 py-2 text-sm text-center text-blue-600'
            data-testid={DataTestIdsEnum.cancelBtn}
            to={routeNames.dashboard}
          >
            « Back
          </MxLink>
        </div>
      </div>
    </div>
  );
};

export const ListToken = () => {
  return <ListTokenForm />;
};
