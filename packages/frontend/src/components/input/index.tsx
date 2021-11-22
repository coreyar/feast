import React, { useState } from 'react'
import './styles.scss'

interface Props {
  type?:
  'button' | 'checkbox' | 'color' | 'date' | 'datetime-label' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' |
  'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week'
  label: string,
  name: string,
  value: string,
  onChange: (value: string) => void,
  error: string | false,
}

const Input = ({
  type = 'text', label, name, value, onChange, error,
}: Props): JSX.Element => {
  const [classNames, setClassNames] = useState('float-label-field')
  const [touched, setTouched] = useState(false)
  const focusClassNames = 'float focus'
  const processEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }
  const onFocus = () => {
    setClassNames([classNames, focusClassNames].join(' '))
    setTouched(true)
  }
  return (
    <fieldset className={classNames}>
      <label htmlFor={name}>{label}</label>
      <input
        placeholder={label}
        onFocus={onFocus}
        onBlur={() => setClassNames(classNames.replace(focusClassNames, '').trim())}
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={processEvent}
      />
      {touched && !value ? <span className="error">{error}</span> : null}
    </fieldset>
  )
}

Input.defaultProps = {
  type: 'text',
}

export default Input
