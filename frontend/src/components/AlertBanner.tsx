import { ReactNode } from 'react';

interface Props {
  type?: 'info' | 'warning' | 'error' | 'success';
  children: ReactNode;
}

export default function AlertBanner({ type = 'info', children }: Props) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}
