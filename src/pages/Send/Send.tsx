import { SendForm } from './components';

export const Send = () => {
  return (
    <div className='flex flex-col p-6 max-w-2xl w-full bg-white shadow-md rounded h-full'>
      <h2 className='text-2xl font-bold p-2 text-center'>Send</h2>
      <p className='text-gray-400 text-center mb-8'>
        Send tokens in an instant
      </p>
      <SendForm />
    </div>
  );
};
