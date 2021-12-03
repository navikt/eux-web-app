import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TextField } from '@navikt/ds-react'

export interface InputProps {
  ariaLabel ?: string
  className ?: string
  error: string | null | undefined
  namespace: string
  id: string
  label: React.ReactNode
  min ?: string
  onContentChange?: (e: string) => void
  onChanged?: (e: string) => void
  placeholder?: string
  required ?: boolean
  type?: 'number' | 'text' | 'tel' | 'url' | 'email' | 'password' | undefined
  style ?: any
  value: string | undefined
}
const Input: React.FC<InputProps> = ({
  ariaLabel,
  className,
  error,
  id,
  label,
  min,
  namespace,
  onContentChange = () => {},
  onChanged = () => {},
  placeholder,
  required = false,
  type = 'text',
  value
}: InputProps) => {
  const [_value, _setValue] = useState<string>(value ?? '')
  const [_dirty, _setDirty] = useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <TextField
      aria-invalid={!!error}
      aria-label={ariaLabel}
      className={className}
      data-test-id={namespace + '-' + id}
      error={error}
      id={namespace + '-' + id}
      label={label}
      onBlur={() => {
        if (_dirty) {
          onChanged(_value)
          _setDirty(false)
        }
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onContentChange(e.target.value)
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
