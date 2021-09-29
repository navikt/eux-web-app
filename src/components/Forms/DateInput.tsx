import { toFinalDateFormat, toUIDateFormat } from 'components/Forms/PeriodeInput'
import { HighContrastInput } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface DateInputProps {
  ariaLabel ?: string
  className ?: string
  feil: string | null | undefined
  id: string
  index?: number
  label: string
  namespace: string
  onChanged: (dato: string) => void
  placeholder?: string
  required ?: boolean
  value: string | undefined
}

const DateInput = ({
  ariaLabel,
  className,
  feil,
  id,
  label,
  namespace,
  onChanged,
  placeholder,
  required = false,
  value
}: DateInputProps) => {
  const [_dato, _setDato] = useState<string>(() => toUIDateFormat(value) ?? '')
  const [_dirty, _setDirty] = useState<boolean>(false)
  const { t } = useTranslation()

  const onDatoBlur = () => {
    const date = toFinalDateFormat(_dato)
    onChanged(date)
  }

  return (
    <HighContrastInput
      aria-invalid={!!feil}
      aria-label={ariaLabel ?? label}
      className={className}
      data-test-id={namespace + ''}
      feil={feil}
      id={namespace + '-' + id}
      label={label ?? t('label:dato')}
      onBlur={() => {
        if (_dirty) {
          onDatoBlur()
          _setDirty(false)
        }
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        _setDato(e.target.value)
        _setDirty(true)
      }}
      placeholder={placeholder || t('el:placeholder-date-default')}
      required={required}
      value={_dato}
    />
  )
}

export default DateInput
