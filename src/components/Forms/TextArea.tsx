import { Textarea } from '@navikt/ds-react'
import React, { useState } from 'react'

export interface TextAreaProps {
  className ?: string
  description ?: string
  error: string | undefined
  namespace: string
  id: string
  label: string
  maxLength ?: number
  onChanged: (e: string) => void
  required?: boolean
  style?: any
  value: string | undefined
}
const TextArea: React.FC<TextAreaProps> = ({
  className,
  description,
  error,
  namespace,
  id,
  label,
  maxLength = 500,
  onChanged,
  required = false,
  style = {},
  value
}: TextAreaProps) => {
  const [_value, _setValue] = useState<string>(value ?? '')
  const [_dirty, _setDirty] = useState<boolean>(false)

  return (
    <Textarea
      className={className}
      aria-label={label}
      style={style}
      data-testid={namespace + '-' + id}
      description={description}
      error={error}
      id={namespace + '-' + id}
      label={label + (required ? ' *' : '')}
      maxLength={maxLength}
      onBlur={() => {
        if (_dirty) {
          onChanged(_value)
          _setDirty(false)
        }
      }}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        _setValue(e.target.value)
        _setDirty(true)
      }}
      required={required}
      value={_value}
    />
  )
}

export default TextArea
