import React from 'react';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
                                                variant = 'primary',
                                                size = 'medium',
                                                fullWidth = false,
                                                disabled,
                                                className = '',
                                                children,
                                                ...props
                                              }) => {

  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    (disabled) && styles.disabled,
    className,
  ]
    .join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

