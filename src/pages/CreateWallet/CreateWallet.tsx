import { Buffer } from 'buffer';
import React, { useState } from 'react';
import { Address } from '@multiversx/sdk-core';
import { UserWallet, Mnemonic, UserSecretKey } from '@multiversx/sdk-wallet';
import { useNavigate } from 'react-router-dom';
import { routeNames } from 'routes';

const createKeystoreFromMnemonic = async (password: string) => {
  try {
    const mnemonicService = Mnemonic.generate();
    const mnemonic = mnemonicService.toString();
    const secretKey: UserSecretKey = mnemonicService.deriveKey();

    const randomness = {
      id: '1',
      iv: Buffer.from('randomIVrandomIV', 'utf-8'),
      salt: Buffer.from('randomSalt')
    };

    const userWallet = UserWallet.fromSecretKey({
      secretKey,
      password,
      randomness
    });

    const publicKeyHex = secretKey.generatePublicKey().hex();
    const address = new Address(publicKeyHex);

    const keystoreJSON = userWallet.toJSON();
    return {
      mnemonic,
      address: address.bech32(),
      keystore: keystoreJSON
    };
  } catch (error) {
    console.error('Keystore creation failed:', error);
    throw error;
  }
};

export const CreateWallet: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>('');
  const [mnemonic, setMnemonic] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [keystore, setKeystore] = useState<string>('');
  const [verificationWords, setVerificationWords] = useState<
    { index: number; word: string }[]
  >([]);
  const [verificationInput, setVerificationInput] = useState<{
    [key: number]: string;
  }>({});
  const [verificationError, setVerificationError] = useState<string>('');
  const [isAcknowledged, setIsAcknowledged] = useState<boolean>(false);
  const [isVerificationPhase, setIsVerificationPhase] =
    useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const handleCreateWallet = async () => {
    try {
      const result = await createKeystoreFromMnemonic(password);
      setMnemonic(result.mnemonic);
      setWalletAddress(result.address);
      setKeystore(JSON.stringify(result.keystore, null, 2));

      // Rastgele 3 kelime seç
      const words = result.mnemonic.split(' ');
      const randomIndices = Array.from({ length: 3 }, () =>
        Math.floor(Math.random() * 24)
      );
      setVerificationWords(
        randomIndices.map((index) => ({ index, word: words[index] }))
      );
    } catch (error) {
      console.error('Error creating keystore:', error);
    }
  };

  const handleVerificationInput = (index: number, value: string) => {
    setVerificationInput((prevState) => ({ ...prevState, [index]: value }));
  };

  const handleVerify = () => {
    let isValid = true;
    for (const { index, word } of verificationWords) {
      if (verificationInput[index] !== word) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      downloadKeystore();
      setIsVerified(true);
    } else {
      setVerificationError('Mnemonic words do not match. Please try again.');
    }
  };

  const downloadKeystore = () => {
    const element = document.createElement('a');
    const file = new Blob([keystore], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${walletAddress}.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className='flex flex-col p-6 max-w-2xl w-full bg-white shadow-md rounded h-full'>
      <div className='flex flex-col gap-6'>
        <h2 className='text-2xl font-bold p-2 mb-2 text-center'>
          Create Wallet
        </h2>
        <div className='text-sm border border-gray-200 rounded-xl p-6'>
          {!isVerificationPhase ? (
            <>
              <div className='mb-6'>
                <div className='flex flex-col mb-4'>
                  <label className='text-xs mb-2'>Password:</label>
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter your password'
                    className='bg-gray-100 p-3 rounded-xl outline-none'
                  />
                </div>
              </div>
              <button
                onClick={handleCreateWallet}
                className='w-full bg-blue-500 text-white py-3 rounded-md text-base'
              >
                Create a new wallet
              </button>
              {mnemonic && (
                <div className='mt-4'>
                  <h3 className='text-lg font-bold'>Mnemonic:</h3>
                  <p>{mnemonic}</p>
                  <button
                    onClick={() => copyToClipboard(mnemonic)}
                    className='w-full bg-yellow-500 text-white py-3 rounded-md text-base mt-2'
                  >
                    Copy Mnemonic
                  </button>
                </div>
              )}
              {mnemonic && (
                <div className='mt-4'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={isAcknowledged}
                      onChange={(e) => setIsAcknowledged(e.target.checked)}
                      className='mr-2'
                    />
                    <span>
                      I acknowledge that if I lose my mnemonic, my wallet cannot
                      be recovered.
                    </span>
                  </label>
                  <button
                    onClick={() => setIsVerificationPhase(true)}
                    className='w-full bg-green-500 text-white py-3 rounded-md text-base mt-2'
                    disabled={!isAcknowledged}
                  >
                    Proceed to Verification
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {!isVerified ? (
                <>
                  <h3 className='text-lg font-bold'>Verify Mnemonic</h3>
                  <p>Please enter the following words from your mnemonic:</p>
                  {verificationWords.map(({ index }) => (
                    <div key={index} className='mb-2'>
                      <label className='text-xs mb-1'>Word #{index + 1}</label>
                      <input
                        type='text'
                        value={verificationInput[index] || ''}
                        onChange={(e) =>
                          handleVerificationInput(index, e.target.value)
                        }
                        className='bg-gray-100 p-2 rounded-xl outline-none'
                      />
                    </div>
                  ))}
                  {verificationError && (
                    <p className='text-red-500'>{verificationError}</p>
                  )}
                  <button
                    onClick={handleVerify}
                    className='w-full bg-green-500 text-white py-3 rounded-md text-base mt-2'
                  >
                    Verify and Download Keystore
                  </button>
                </>
              ) : (
                <div className='text-center'>
                  <div className='text-6xl text-green-500'>✓</div>
                  <h3 className='text-lg font-bold mt-4'>
                    Wallet Created Successfully!
                  </h3>
                  <p className='mt-2'>
                    Your wallet is ready. Enjoy the world of blockchain!
                  </p>
                  <button
                    onClick={() => navigate(routeNames.unlock)}
                    className='w-full bg-blue-500 text-white py-3 rounded-md text-base mt-4'
                  >
                    Go to Unlock
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
