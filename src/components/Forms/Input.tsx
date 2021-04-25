import { HighContrastInput } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface InputProps {
  className ?: string
  feil: string | undefined
  namespace: string
  id: string
  label: JSX.Element | string
  onChanged: (e: string) => void
  placeholder?: string
  type?: string
  value: string | undefined
}
const Input: React.FC<InputProps> = ({
  className,
  feil,
  namespace,
  id,
  label,
  onChanged,
  placeholder,
  type = 'text',
  value
}: InputProps) => {
  const [_value, _setValue] = useState<string>(value ?? '')
  const [_dirty, _setDirty] = useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <HighContrastInput
      className={className}
      data-test-id={namespace + '-' + id}
      feil={feil}
      id={namespace + '-' + id}
      label={label}
      onBlur={() => {
        if (_dirty) {
          onChanged(_value)
          _setDirty(false)
        }
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        _setValue(e.target.value)
        _setDirty(true)
      }}
      placeholder={placeholder || t('el:placeholder-input-default')}
      type={type}
      value={_value}
    />
  )
}

export default Input
