import { HighContrastTextArea } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface TextAreaProps {
  className ?: string
  feil: string | undefined
  namespace: string
  id: string
  label: string
  maxLength ?: number
  onChanged: (e: string) => void
  placeholder?: string
  value: string | undefined
}
const TextArea: React.FC<TextAreaProps> = ({
  className,
  feil,
  namespace,
  id,
  label,
  maxLength = 500,
  onChanged,
  placeholder,
  value
}: TextAreaProps) => {
  const [_value, _setValue] = useState<string>(value ?? '')
  const [_dirty, _setDirty] = useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <HighContrastTextArea
      className={className}
      data-test-id={'c-' + namespace + '-' + id}
      feil={feil}
      id={'c-' + namespace + '-' + id}
      label={label}
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
      placeholder={placeholder || t('el:placeholder-textarea-default')}
      value={_value}
    />
  )
}

export default TextArea
