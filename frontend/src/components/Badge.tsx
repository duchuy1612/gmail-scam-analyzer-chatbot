import { ReactNode } from 'react';

interface Props {
  variant?: 'safe' | 'phishing' | 'warning';
  children: ReactNode;
}

export default function Badge({ variant = 'safe', children }: Props) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
