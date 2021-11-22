import React from 'react'
import './styles.scss'

interface Props {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactChildren | string,
  type?: 'button' | 'submit' | 'reset',
  disabled?: boolean,
  className?: string
}

const Button = ({
  onClick, children, type = 'button', disabled, className = '',
}: Props): JSX.Element => (
  <button disabled={disabled} type={type} onClick={onClick} className={`base-button ${className}`}>{children}</button>
)

Button.defaultProps = {
  onClick: undefined,
  type: 'button',
  disabled: false,
  className: undefined,
}

export default Button
