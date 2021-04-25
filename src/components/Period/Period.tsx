import moment from 'moment'
import { Column, HighContrastInput } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface PeriodProps {
  errorStartDato: string | null | undefined
  errorSluttDato: string | null | undefined
  index?: number
  labels?: boolean
  labelStartDato ?: string
  labelSluttDato ?: string
  namespace: string
  setStartDato: (dato: string) => void
  setSluttDato: (dato: string) => void
  valueStartDato: string | undefined
  valueSluttDato: string | undefined
}

export const toFinalDateFormat = (date: string | undefined): string => {
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
  labels = true,
  labelStartDato,
  labelSluttDato,
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
    setStartDato(date)
  }

  const onEndDatoBlur = () => {
    const date = toFinalDateFormat(_sluttDato)
    setSluttDato(date)
  }

  return (
    <>
      <Column>
        <HighContrastInput
          data-test-id={namespace + '-startdato'}
          feil={errorStartDato}
          id={namespace + '-startdato'}
          label={labels ? labelStartDato || t('label:startdato') + ' *' : ''}
          onBlur={onStartDatoBlur}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setStartDato(e.target.value)}
          placeholder={t('el:placeholder-date-default')}
          value={_startDato}
        />
      </Column>
      <Column>
        <HighContrastInput
          data-test-id={namespace + '-sluttdato'}
          feil={errorSluttDato}
          id={namespace + '-sluttdato'}
          label={labels ? labelSluttDato || t('label:sluttdato') : ''}
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
