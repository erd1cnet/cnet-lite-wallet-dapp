// swap/Swap.tsx
import { SwapForm } from './components';
import { useGetAccountInfo } from 'lib';

const SwapNew = () => {
  const { address } = useGetAccountInfo();

  return (
    <div>
      <SwapForm address={address} />
    </div>
  );
};

export default SwapNew;
