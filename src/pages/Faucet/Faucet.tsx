import React, { useState } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import axios from 'axios';
import { useGetAccountInfo } from 'lib';

const FaucetForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [message, setMessage] = useState<string | null>(null);
  const { address } = useGetAccountInfo();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!executeRecaptcha) {
      setMessage('Recaptcha not yet available');
      return;
    }

    const recaptchaToken = await executeRecaptcha('faucet');

    try {
      const response = await axios.post('http://localhost:8000/faucet/', {
        recaptcha: recaptchaToken,
        wallet_address: address,
      });

      setMessage(response.data.success ? 'Tokens sent successfully!' : response.data.error);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.error || 'An error occurred. Please try again.');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className='flex flex-col p-6 max-w-2xl w-full bg-white shadow-md rounded h-full'>
      <div className='flex flex-col gap-6'>
        <h2 className='text-2xl font-bold p-2 mb-2 text-center'>Faucet</h2>
        <div className='text-sm border border-gray-200 rounded-xl p-6'>
          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <div className='flex justify-between items-center mb-1 mx-1'>
                <span className='text-xs'>Wallet Address:</span>
                <span className='text-xs'>{address}</span>
              </div>
              <div className='flex items-center p-3 rounded-xl bg-gray-100'>
                <input
                  type='text'
                  value={address}
                  readOnly
                  className='bg-transparent pl-3 text-black flex-grow outline-none'
                  style={{ minWidth: '0' }}
                />
              </div>
            </div>
            <button className='w-full bg-blue-500 text-white py-3 rounded-md text-base' type="submit">
              Get Tokens
            </button>
            {message && <p className='mt-4 text-center'>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export const Faucet = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LeUHQkqAAAAACqtboSbrGrSWoTTH49TvCK3SyNK">
      <FaucetForm />
    </GoogleReCaptchaProvider>
  );
};
