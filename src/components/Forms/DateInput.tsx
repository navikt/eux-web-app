import { toFinalDateFormat, toUIDateFormat } from 'components/Period/Period'
import { HighContrastInput } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface DateInputProps {
  error: string | null | undefined
  index?: number
  label: string
  namespace: string
  setDato: (dato: string, index: number) => void
  value: string | undefined
}

const DateInput = ({
  error,
  index = -1,
  label,
  namespace,
  setDato,
  value
}: DateInputProps) => {
  const [_dato, _setDato] = useState<string>(() => toUIDateFormat(value) ?? '')
  const [_dirty, _setDirty] = useState<boolean>(false)
  const { t } = useTranslation()

  const onDatoBlur = () => {
    const date = toFinalDateFormat(_dato)
    setDato(date, index)
  }

  return (
    <HighContrastInput
      data-test-id={namespace + ''}
      feil={error}
      id={namespace + ''}
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
      placeholder={t('el:placeholder-date-default')}
      value={_dato}
    />
  )
}

export default DateInput
