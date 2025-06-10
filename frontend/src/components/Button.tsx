import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  const variantClass = `btn btn-${variant}`;
  return <button className={`${variantClass} ${className}`} {...props} />;
}
