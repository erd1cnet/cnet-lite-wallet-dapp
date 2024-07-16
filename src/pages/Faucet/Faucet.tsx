import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha
} from 'react-google-recaptcha-v3';
import { useNavigate } from 'react-router-dom';
import { MxLink } from 'components';
import { useGetAccountInfo, useGetIsLoggedIn } from 'lib';
import { DataTestIdsEnum } from 'localConstants';
import { routeNames } from 'routes';



const FaucetForm = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [message, setMessage] = useState<string | null>(null);
  const { address } = useGetAccountInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(routeNames.unlock);
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!executeRecaptcha) {
      setMessage('reCAPTCHA is not ready yet');
      return;
    }

    const recaptchaToken = await executeRecaptcha('faucet');

    try {
      const response = await axios.post(
        'https://testnet-extras-api.cyber.network/faucet/',
        {
          recaptcha: recaptchaToken,
          wallet_address: address
        },
        {
          withCredentials: true
        }
      );

      setMessage(
        response.data.success
          ? 'Tokens were sent successfully!'
          : response.data.error
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(
          error.response.data.error || 'An error occurred. Please try again.'
        );
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className='flex flex-col p-6 max-w-2xl w-full bg-white shadow-md rounded h-full'>
      <div className='flex flex-col'>
        <h2 className='text-2xl font-bold p-2 text-center'>xCNET Faucet</h2>
        <p className='text-gray-400 text-center mb-8'>You can request 1000 xCNET every 24 hours</p>
        <div className='text-sm border border-gray-200 rounded-xl p-6'>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <div className='text-sm text-gray-400'>Your address:</div>
              <div className='overflow-hidden break-all text-sm'>{address}</div>
            </div>
            <button className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white text-base' type='submit'>
              Request Tokens
            </button>
            <p className='mt-2 text-center'>{message}</p>
          </form>
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

export const Faucet = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey='6LeUHQkqAAAAACqtboSbrGrSWoTTH49TvCK3SyNK'>
      <FaucetForm />
    </GoogleReCaptchaProvider>
  );
};
