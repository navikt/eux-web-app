import { Textarea } from '@navikt/ds-react'
import React, { useState } from 'react'
import {useAppDispatch} from "../../store";
import {setTextAreaDirty} from "../../actions/ui";

export interface TextAreaProps {
  className ?: string
  description ?: string
  error: string | undefined
  namespace: string
  id: string
  label: string
  maxLength ?: number
  cols?: number
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
  cols,
  onChanged,
  required = false,
  style = {},
  value
}: TextAreaProps) => {
  const [_value, _setValue] = useState<string>(value ?? '')
  const [_dirty, _setDirty] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  const doSetDirty = (isDirty: boolean) => {
    _setDirty(isDirty)
    dispatch(setTextAreaDirty(isDirty))
  }

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
      cols={cols}
      onBlur={() => {
        if (_dirty) {
          onChanged(_value)
          doSetDirty(false)
        }
      }}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        _setValue(e.target.value)
        doSetDirty(true)
      }}
      required={required}
      value={_value}
    />
  )
}

export default TextArea
