import _ from 'lodash'
import React, { useState } from 'react'
import { TextField } from '@navikt/ds-react'
import {useAppDispatch} from "../../store";
import {setTextFieldDirty} from "../../actions/ui";

export interface InputProps {
  ariaLabel ?: string
  className ?: string
  description ?: string
  disabled ?: boolean
  error: string | null | undefined
  namespace: string
  hideLabel?: boolean
  id: string
  label: React.ReactNode
  min ?: string
  onContentChange ?: (e: string) => void
  onChanged ?: (e: string) => void
  required ?: boolean
  type?: 'number' | 'text' | 'tel' | 'url' | 'email' | 'password' | undefined
  style ?: any
  value: string | null | undefined
}
const Input: React.FC<InputProps> = ({
  ariaLabel,
  className,
  description,
  disabled = false,
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

  const dispatch = useAppDispatch()

  const doSetDirty = (isDirty: boolean) => {
    _setDirty(isDirty)
    dispatch(setTextFieldDirty(isDirty))
  }

  return (
    <TextField
      aria-invalid={!!error}
      aria-label={ariaLabel}
      className={className}
      data-testid={namespace + '-' + id}
      description={description}
      disabled={disabled}
      error={error}
      id={namespace + '-' + id}
      hideLabel={hideLabel}
      label={_.isString(label)
        ? label + (required ? ' *' : '')
        : label}
      onBlur={() => {
        if (_dirty) {
          onChanged!(_value)
          doSetDirty(false)
        }
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onContentChange!(e.target.value)
        _setValue(e.target.value)
        doSetDirty(true)
      }}
      required={required}
      type={type}
      value={_value}
      min={min}
    />
  )
}

export default Input
