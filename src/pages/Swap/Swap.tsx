// swap/Swap.tsx
import { useEffect } from 'react';
import { SwapForm } from './components';
import { useGetAccountInfo, useGetIsLoggedIn } from 'lib';
import { routeNames } from 'routes';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <SwapForm address={address} />
    </div>
  );
};

export default Swap;
