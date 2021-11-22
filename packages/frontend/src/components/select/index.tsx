import React from 'react'
import './styles.scss'

interface Props {
  options: Array<{ value: string, label: string }>,
  value: string,
  onChange: (value: string) => void,
  name: string,
  label: string,
}

const Select = ({
  options, value, onChange, name, label,
}: Props) : JSX.Element => {
  const processEvent = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value)
  }
  return (
    <fieldset className="field">
      <label htmlFor="items">{label}</label>
      <select name={name} id={name} value={value} onChange={processEvent}>
        {options.map(({ value: v, label: l }) => <option key={v} value={v}>{l}</option>)}
      </select>
    </fieldset>
  )
}
export default Select
