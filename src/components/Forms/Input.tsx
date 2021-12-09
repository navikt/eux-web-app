import React, { useState } from 'react'
import { TextField } from '@navikt/ds-react'

export interface InputProps {
  ariaLabel ?: string
  className ?: string
  error: string | null | undefined
  namespace: string
  hideLabel?: boolean
  id: string
  label: React.ReactNode
  min ?: string
  onContentChange?: (e: string) => void
  onChanged?: (e: string) => void
  required ?: boolean
  type?: 'number' | 'text' | 'tel' | 'url' | 'email' | 'password' | undefined
  style ?: any
  value: string | undefined
}
const Input: React.FC<InputProps> = ({
  ariaLabel,
  className,
  error,
  hideLabel = false,
  id,
  label,
  min,
  namespace,
  onContentChange = () => {},
  onChanged = () => {},
  required = false,
  type = 'text',
  value
}: InputProps) => {
  const [_value, _setValue] = useState<string>(value ?? '')
  const [_dirty, _setDirty] = useState<boolean>(false)

  return (
    <TextField
      aria-invalid={!!error}
      aria-label={ariaLabel}
      className={className}
      data-test-id={namespace + '-' + id}
      error={error}
      id={namespace + '-' + id}
      hideLabel={hideLabel}
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
      required={required}
      type={type}
      value={_value}
      min={min}
    />
  )
}

export default Input
