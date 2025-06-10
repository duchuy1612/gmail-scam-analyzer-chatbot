import { ReactNode } from 'react';

interface Props {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Card({ title, children, footer }: Props) {
  return (
    <div className="card">
      {title && <h3>{title}</h3>}
      <div>{children}</div>
      {footer && <div className="mt-2">{footer}</div>}
    </div>
  );
}
