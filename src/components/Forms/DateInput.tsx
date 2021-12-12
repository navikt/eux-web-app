import { TextField } from '@navikt/ds-react'
import { toFinalDateFormat, toUIDateFormat } from 'components/Forms/PeriodeInput'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface DateInputProps {
  ariaLabel ?: string
  className ?: string
  error: string | null | undefined
  id: string
  index?: number
  label: string
  namespace: string
  onChanged: (dato: string) => void
  required ?: boolean
  value: string | undefined
}

const DateInput = ({
  ariaLabel,
  className,
  error,
  id,
  label,
  namespace,
  onChanged,
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
    <TextField
      aria-invalid={!!error}
      aria-label={ariaLabel ?? label}
      className={className}
      data-test-id={namespace + ''}
      error={error}
      id={namespace + '-' + id}
      label={(label ?? t('label:dato')) + ' (' + t('el:placeholder-date-default') + ')'}
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
      required={required}
      value={_dato}
    />
  )
}

export default DateInput
