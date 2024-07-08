import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MxLink } from 'components';
import { DataTestIdsEnum } from 'localConstants';
import { routeNames } from 'routes';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import axios from 'axios';
import { useGetAccountInfo, useGetIsLoggedIn } from 'lib';

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
      setMessage('Recaptcha henüz hazır değil');
      return;
    }

    const recaptchaToken = await executeRecaptcha('faucet');

    try {
      const response = await axios.post('https://testnet-extras-api.cyber.network/faucet/', {
        recaptcha: recaptchaToken,
        wallet_address: address,
      }, {
        withCredentials: true,
      });

      setMessage(response.data.success ? 'Tokenler başarıyla gönderildi!' : response.data.error);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      } else {
        setMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
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
                <span className='text-xs'>Cüzdan Adresi:</span>
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
              Token Al
            </button>
            {message && <p className='mt-4 text-center'>{message}</p>}
          </form>
        </div>
        <div className='mt-4 flex flex-col align-middle'>
          <MxLink
            className='block w-full mt-2 px-4 py-2 text-sm text-center text-blue-600'
            data-testid={DataTestIdsEnum.cancelBtn}
            to={routeNames.dashboard}
          >
            « Geri
          </MxLink>
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
