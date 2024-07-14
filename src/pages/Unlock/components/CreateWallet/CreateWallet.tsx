import { Buffer } from 'buffer';
import React, { useState } from 'react';
import { Address } from '@multiversx/sdk-core';
import { UserWallet, Mnemonic, UserSecretKey } from '@multiversx/sdk-wallet';
import * as bip39 from 'bip39';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const createKeystoreFromMnemonic = async (mnemonic: string, password: string) => {
  try {
    const mnemonicService = Mnemonic.fromString(mnemonic);
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
      address: address.bech32(),
      keystore: keystoreJSON
    };
  } catch (error) {
    console.error('Keystore creation failed:', error);
    throw error;
  }
};

const ProgressBar: React.FC<{ step: number }> = ({ step }) => {
  const progress = (step / 4) * 100;

  return (
    <div className='flex items-center justify-center'>
      <div className='w-80 bg-gray-200 rounded-full h-2.5 mb-4'>
        <div
          className='bg-blue-500 h-2.5 rounded-full'
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

interface CreateWalletProps {
  onClose: () => void;
}

export const CreateWallet: React.FC<CreateWalletProps> = ({ onClose }) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [mnemonic] = useState<string>(Mnemonic.generate().toString());
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
  const [isPasswordPhase, setIsPasswordPhase] = useState<boolean>(false);
  const [isWalletCreated, setIsWalletCreated] = useState<boolean>(false);
  const [showCreateWallet, setShowCreateWallet] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState(false);

  const handleCreateWallet = async () => {
    const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    if (!passwordRequirements.test(password)) {
      setPasswordError('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }
  
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match. Please try again.');
      return;
    }
  
    setPasswordError('');
    try {
      const result = await createKeystoreFromMnemonic(mnemonic, password);
      setWalletAddress(result.address);
      setKeystore(JSON.stringify(result.keystore, null, 2));
      setIsWalletCreated(true);
      downloadKeystore(result.address, JSON.stringify(result.keystore, null, 2));
    } catch (error) {
      console.error('Error creating keystore:', error);
    }
  };
  

  const handleVerificationInput = (index: number, value: string) => {
    setVerificationInput((prevState) => ({ ...prevState, [index]: value }));
  };

  const handleVerify = () => {
    const isValid = verificationWords.every(
      ({ index, word }) => verificationInput[index] === word
    );

    if (isValid) {
      setIsVerified(true);
      setIsPasswordPhase(true);
    } else {
      setVerificationError('Mnemonic words do not match. Please try again.');
    }
  };

  const downloadKeystore = (address: string, keystore: string) => {
    const element = document.createElement('a');
    const file = new Blob([keystore], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${address}.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // 2 seconds before resetting to faCopy
  };

  const formattedMnemonic = mnemonic.split(' ').map((word, index) => `${index + 1} ${word}`).join('\n');
  const sortedMnemonicWords = bip39.wordlists.english.sort();

  const generateVerificationWords = () => {
    const words = mnemonic.split(' ');
    const randomIndices = new Set<number>();
    while (randomIndices.size < 3) {
      randomIndices.add(Math.floor(Math.random() * 24));
    }
    setVerificationWords(
      Array.from(randomIndices).map((index) => ({ index, word: words[index] }))
    );
  };

  if (!showCreateWallet) {
    return null; // or render another component/page
  }

  return (
    <div className='flex flex-col p-4'>
      <ProgressBar step={isWalletCreated ? 4 : isPasswordPhase ? 3 : isVerificationPhase ? 2 : 1} />
      {!isVerificationPhase && !isPasswordPhase ? (
        <>
          <h2 className='text-2xl font-bold p-2 text-center'>Create Wallet</h2>
          <p className='text-gray-400 text-center mb-8'>Write down these words in this exact order. You can use them to access your wallet, make sure you protect them.</p>
          <div className="text-sm border border-gray-200 rounded-xl p-6">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {mnemonic.split(' ').map((word, index) => (
                  <div
                    key={`${word}-${index}`}
                    className="p-2 bg-gray-200 rounded flex-grow-0 flex-shrink-0"
                  >
                    <div className="flex justify-center items-center">
                      <span className="mr-1 text-xs text-gray-400">{index + 1}</span>
                      <span>{word}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(formattedMnemonic)}
                className="text-xs bg-amber-300 hover:bg-amber-400 py-2 px-3 rounded-md mt-5 mx-auto block"
              >
                <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} /> {isCopied ? 'Copied' : 'Copy'}
              </button>
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAcknowledged}
                    onChange={(e) => setIsAcknowledged(e.target.checked)}
                    className="mr-2"
                  />
                  <span>
                    I acknowledge that if I lose my mnemonic, my wallet cannot be recovered.
                  </span>
                </label>
                <button
                  onClick={() => {
                    generateVerificationWords();
                    setIsVerificationPhase(true);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-base mt-2"
                  disabled={!isAcknowledged}
                >
                  Proceed to Verification
                </button>
              </div>
            </div>
          </div>

        </>
      ) : !isVerified ? (
        <>
          <h2 className='text-2xl font-bold p-2 text-center'>Surprise Quiz</h2>
          <p className='text-gray-400 text-center mb-8'>Enter the words from your Secret Phrase as indicated below.</p>
          <div className='text-sm border border-gray-200 rounded-xl p-6'>
            {verificationWords.map(({ index }) => (
              <div key={index} className='mb-6'>
                <label className='text-xs mb-1 block'>Word {index + 1}</label>
                <input
                  list={`wordlist-${index}`}
                  type='text'
                  value={verificationInput[index] || ''}
                  onChange={(e) =>
                    handleVerificationInput(index, e.target.value)
                  }
                  className='bg-gray-100 p-2 rounded-xl outline-none w-full'
                />
                <datalist id={`wordlist-${index}`}>
                  {sortedMnemonicWords.filter(mnemonicWord => mnemonicWord.startsWith(verificationInput[index] || '')).map((mnemonicWord, idx) => (
                    <option key={idx} value={mnemonicWord} />
                  ))}
                </datalist>
              </div>
            ))}
            {verificationError && (
              <p className='text-red-500'>{verificationError}</p>
            )}
            <button
              onClick={handleVerify}
              className='w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-base mt-2'
            >
              Verify
            </button>
            <button
              onClick={() => setIsVerificationPhase(false)}
              className='text-green text-base mt-4 mx-auto block'
            >
              Back to words
            </button>
          </div>
        </>
      ) : !isWalletCreated ? (
        <>
          <h2 className='text-2xl font-bold p-2 text-center'>Awesome, now create a password</h2>
          <p className='text-gray-400 text-center mb-8'>The wallet made a secret key for you and stored it in a file. <br />Protect your Keystore File with a password.</p>
          <div className='text-sm border border-gray-200 rounded-xl p-6'>
            <div className='mb-6'>
              <div className='flex flex-col mb-4'>
                <label className='text-xs mb-2'>Password</label>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='bg-gray-100 p-3 rounded-xl outline-none'
                />
              </div>
              <div className='flex flex-col mb-4'>
                <label className='text-xs mb-2'>Confirm Password</label>
                <input
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='bg-gray-100 p-3 rounded-xl outline-none'
                />
              </div>
              {passwordError && (
                <p className='text-red-500'>{passwordError}</p>
              )}
            </div>
            <button
              onClick={handleCreateWallet}
              className='w-full bg-blue-500 text-white py-3 rounded-md text-base'
            >
              Create Wallet
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className='text-2xl font-bold p-2 text-center'>Wallet Created</h2>
          <p className='text-gray-400 text-center mb-8'>Your wallet is ready. Enjoy the world of blockchain!</p>
          <div className='text-sm border border-gray-200 rounded-xl p-6 text-center'>
            <div className='text-6xl text-green-500'>✓</div>
            <h3 className='text-lg font-bold mt-4'>
              Wallet created!
            </h3>
            <p className='mt-2'>
              Great work. You downloaded the keystore file. <br />Save it, you’ll need it to access your wallet.
            </p>
            <button
              onClick={() => {
                onClose();
                setShowCreateWallet(false);
              }}
              className='w-full bg-blue-500 text-white py-3 rounded-md text-base mt-5'
            >
              Access Wallet
            </button>
            <button
              onClick={() => downloadKeystore(walletAddress, keystore)}
              className='text-green text-base mt-4'
            >
              Download keystore file again
            </button>
          </div>
        </>
      )}
    </div>
  );
};
