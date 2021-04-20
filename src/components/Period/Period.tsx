import moment from 'moment'
import { Column, HighContrastInput } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface PeriodProps {
  errorStartDato: string | null | undefined
  errorSluttDato: string | null | undefined
  index: number
  namespace: string
  setStartDato: (dato: string, index: number) => void
  setSluttDato: (dato: string, index: number) => void
  valueStartDato: string | undefined
  valueSluttDato: string | undefined
}

export const toFinalDateFormat = (date: string | undefined): string  => {
  if (!date) return ''
  if (date === '') return ''
  const newDate = moment(date, 'DD.MM.YYYY')
  return newDate.isValid() ? newDate.format('YYYY-MM-DD') : date
}

export const toUIDateFormat = (date: string | undefined): string | undefined => {
  if (!date) return undefined
  const newDate = moment(date, 'YYYY-MM-DD')
  return newDate.isValid() ? newDate.format('DD.MM.YYYY') : date
}

const Period = ({
  errorStartDato,
  errorSluttDato,
  index,
  namespace,
  setStartDato,
  setSluttDato,
  valueStartDato,
  valueSluttDato
 }: PeriodProps) => {
  const [_startDato, _setStartDato] = useState<string>(() => toUIDateFormat(valueStartDato) ?? '')
  const [_sluttDato, _setSluttDato] = useState<string>(() => toUIDateFormat(valueSluttDato) ?? '')
  const { t } = useTranslation()

  const onStartDatoBlur = () => {
    const date = toFinalDateFormat(_startDato)
    setStartDato(date, index)
  }

  const onEndDatoBlur = () => {
    const date = toFinalDateFormat(_sluttDato)
    setSluttDato(date, index)
  }

  return (
    <>
      <Column>
        <HighContrastInput
          data-test-id={'c-' + namespace + (index >= 0 ? '[' + index + ']' : '') + '-startdato-date'}
          feil={errorStartDato}
          id={'c-' + namespace + '[' + index + ']-startdato-date'}
          label={t('label:startdato')}
          onBlur={onStartDatoBlur}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setStartDato(e.target.value)}
          placeholder={t('el:placeholder-date-default')}
          value={_startDato}
        />
      </Column>
      <Column>
        <HighContrastInput
          data-test-id={'c-' + namespace + (index >= 0 ? '[' + index + ']' : '') + '-sluttdato-date'}
          feil={errorSluttDato}
          id={'c-' + namespace + (index >= 0 ? '[' + index + ']' : '') + '-sluttdato-date'}
          label={t('label:sluttdato')}
          onBlur={onEndDatoBlur}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setSluttDato(e.target.value)}
          placeholder={t('el:placeholder-date-default')}
          value={_sluttDato}
        />
      </Column>
    </>
  )
}

export default Period
