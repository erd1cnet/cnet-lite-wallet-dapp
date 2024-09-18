// swap/Swap.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAccountInfo, useGetIsLoggedIn } from 'lib';
import { routeNames } from 'routes';
import { SwapForm } from './components';

const Swap = () => {
  const { address } = useGetAccountInfo();
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
        <h2 className='text-2xl font-bold p-2 text-center'>Swap</h2>
        <p className='text-gray-400 text-center mb-8'>
          Trade tokens in an instant
        </p>
        <SwapForm address={address} />
      </div>
    </div>
  );
};

export default Swap;
