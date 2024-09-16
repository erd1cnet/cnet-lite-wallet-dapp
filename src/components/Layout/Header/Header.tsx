import { useState } from 'react';
import { faPowerOff, faBars } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMatch } from 'react-router-dom';
import { MxLink } from 'components/MxLink';
import { environment } from 'config';
import { useGetIsLoggedIn } from 'lib';
import { RouteNamesEnum } from 'localConstants';
import { routeNames } from 'routes';
import MultiversXLogo from '../../../assets/img/cybernetwork-logo.svg?react';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = useGetIsLoggedIn();
  const isUnlockRoute = Boolean(useMatch(RouteNamesEnum.unlock));
  const isHomeRoute = Boolean(useMatch('/'));

  const ConnectButton = !isUnlockRoute ? (
    <MxLink to={RouteNamesEnum.unlock}>
      Connect
      <FontAwesomeIcon className='pl-2' icon={faArrowRightFromBracket} />
    </MxLink>
  ) : null;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className='bg-white border-gray-200'>
      <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 min-h-[72px]'>
        <MxLink
          to={isLoggedIn ? routeNames.dashboard : routeNames.home}
          className='flex items-center space-x-1'
        >
          <MultiversXLogo className='h-7' />
          <div className='flex gap-1 items-center pl-3'>
            <div className='w-2 h-2 rounded-full bg-green-500' />
            <p className='text-gray-500 text-xs'>{environment}</p>
          </div>
        </MxLink>
        <div className='flex md:order-2 space-x-2 md:space-x-0'>
          {isLoggedIn ? (
            <MxLink
              className='flex items-center rounded-lg px-3.5 py-3 bg-red-600 hover:bg-red-700 text-white'
              to={routeNames.logout}
            >
              <FontAwesomeIcon icon={faPowerOff} />
            </MxLink>
          ) : (
            ConnectButton
          )}
          {!isUnlockRoute && !isHomeRoute && (
            <button
              data-collapse-toggle='navbar-cta'
              type='button'
              className='flex items-center rounded-lg px-3.5 py-3 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden text-black'
              aria-controls='navbar-cta'
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          )}
        </div>
        {!isUnlockRoute && !isHomeRoute && (
          <div
            className={`items-center justify-between ${
              isMobileMenuOpen ? 'block' : 'hidden'
            } w-full md:flex md:w-auto md:order-1`}
            id='navbar-cta'
          >
            <ul className='flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white'>
              <li>
                <MxLink
                  to={routeNames.dashboard}
                  className='block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'
                >
                  Dashboard
                </MxLink>
              </li>
              <li>
                <MxLink
                  to={routeNames.send}
                  className='block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'
                >
                  Send
                </MxLink>
              </li>
              <li>
                <MxLink
                  to={routeNames.swap}
                  className='block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'
                >
                  Swap
                </MxLink>
              </li>
              <li>
                <MxLink
                  to={routeNames.listToken}
                  className='block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'
                >
                  List Token (beta)
                </MxLink>
              </li>
              <li>
                <MxLink
                  to={routeNames.faucet}
                  className='block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'
                >
                  Faucet
                </MxLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};
