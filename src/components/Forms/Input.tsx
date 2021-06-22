import { HighContrastInput } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface InputProps {
  ariaLabel ?: string
  className ?: string
  feil: string | null | undefined
  namespace: string
  id: string
  label: JSX.Element | string
  min ?: string
  onChanged: (e: string) => void
  placeholder?: string
  required ?: boolean
  type?: string
  value: string | undefined
}
const Input: React.FC<InputProps> = ({
  ariaLabel,
  className,
  feil,
  id,
  label,
  min,
  namespace,
  onChanged,
  placeholder,
  required = false,
  type = 'text',
  value
}: InputProps) => {
  const [_value, _setValue] = useState<string>(value ?? '')
  const [_dirty, _setDirty] = useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <HighContrastInput
      aria-invalid={!!feil}
      aria-label={ariaLabel ?? label}
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
      required={required}
      type={type}
      value={_value}
      min={min}
    />
  )
}

export default Input
