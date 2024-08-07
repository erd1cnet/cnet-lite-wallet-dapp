import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { faBroom, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGetSignMessageSession } from '@multiversx/sdk-dapp/hooks/signMessage/useGetSignMessageSession';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'components/Button';
import { OutputContainer } from 'components/OutputContainer';
import { useReplyWithCancelled } from 'hooks';
import { parseQueryParams, useSignMessage } from 'lib';
import { CANCELLED, DataTestIdsEnum, HooksEnum } from 'localConstants';
import { hookSelector } from 'redux/selectors';
import { routeNames } from 'routes';
import { SignedMessageStatusesEnum } from 'types';
import { SignFailure, SignSuccess } from './components';
import { useSignMessageCompleted } from './hooks';

export const SignMessage = () => {
  const { sessionId, signMessage, onAbort, onCancel } = useSignMessage();
  const messageSession = useGetSignMessageSession(sessionId);
  const { type: hook, callbackUrl, hookUrl } = useSelector(hookSelector);
  const navigate = useNavigate();
  const replyWithCancelled = useReplyWithCancelled({
    caller: 'SignModals'
  });
  const signMessageCompleted = useSignMessageCompleted();

  const isSignMessageHook = hook === HooksEnum.signMessage;

  const [message, setMessage] = useState<string>(
    isSignMessageHook ? String(parseQueryParams(hookUrl).message) : ''
  );

  const handleSubmit = (e: MouseEvent) => {
    e.preventDefault();

    if (messageSession) {
      onAbort();
    }

    if (!message.trim()) {
      return;
    }

    signMessage({
      message,
      callbackRoute: window.location.href
    });
  };

  const isSuccess =
    messageSession?.message &&
    messageSession?.status === SignedMessageStatusesEnum.signed;

  useEffect(() => {
    if (isSuccess && isSignMessageHook) {
      signMessageCompleted({ isSuccess, signedMessageInfo: messageSession });
    }
  }, [isSuccess]);

  // Clear state on destroy
  useEffect(
    () => () => {
      onAbort();
      setMessage('');
    },
    []
  );

  const handleSignMessageCloseFlow = () => {
    if (!isSignMessageHook) {
      onAbort();
      navigate(routeNames.dashboard);
      return;
    }

    onCancel({
      errorMessage: CANCELLED,
      callbackRoute: callbackUrl ?? window.location.href
    });

    replyWithCancelled();
    navigate(routeNames.dashboard);
  };

  const isError = messageSession
    ? [
        (SignedMessageStatusesEnum.cancelled, SignedMessageStatusesEnum.failed)
      ].includes(messageSession.status) && messageSession?.message
    : false;

  return (
    <div
      className='flex flex-col p-6 max-w-2xl w-full bg-white shadow-md rounded h-full'
      data-testid={DataTestIdsEnum.signMessagePage}
    >
      <div className='flex flex-col'>
      <h2 className='text-2xl font-bold p-2 text-center'>Sign Message</h2>
      <p className='text-gray-400 text-center mb-8'>Type in the message that you would like to sign</p>
        <OutputContainer>
          {!isSuccess && !isError && (
            <textarea
              placeholder='Write message here'
              disabled={isSignMessageHook}
              value={message}
              className='resize-none w-full h-32 rounded-lg focus:outline-none focus:border-blue-600'
              onChange={(event) => setMessage(event.currentTarget.value)}
            />
          )}

          {isSuccess && (
            <SignSuccess messageToSign={messageSession?.message ?? ''} />
          )}

          {isError && <SignFailure />}
        </OutputContainer>
        <div className='my-2 flex flex-col gap-4 mt-6'>
          {isSuccess || isError ? (
            <Button
              data-testid={DataTestIdsEnum.cancelSignMessageBtn}
              className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white text-base'
              id='closeButton'
              onClick={handleSignMessageCloseFlow}
            >
              <FontAwesomeIcon
                icon={isSuccess ? faBroom : faArrowsRotate}
                className='mr-1'
              />
              {isError ? 'Try again' : 'Clear'}
            </Button>
          ) : (
            <Button
              className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white text-base'
              data-testid={DataTestIdsEnum.signMessageBtn}
              onClick={handleSubmit}
            >
              Sign Message
            </Button>
          )}

          <Button
            data-testid={DataTestIdsEnum.cancelSignMessageBtn}
            className='mx-auto text-blue-600 text-sm'
            id='closeButton'
            onClick={handleSignMessageCloseFlow}
          >
            « Back
          </Button>
        </div>
      </div>
    </div>
  );
};
