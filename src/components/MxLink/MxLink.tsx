import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { WithClassnameType } from 'types';

interface MxLinkPropsType extends PropsWithChildren, WithClassnameType {
  to: string;
}

export const MxLink = ({
  'data-testid': dataTestId,
  children,
  className = 'flex items-center rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white',
  to
}: MxLinkPropsType) => {
  return (
    <Link data-testid={dataTestId} to={to} className={className}>
      {children}
    </Link>
  );
};
