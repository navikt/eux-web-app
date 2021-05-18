import Input from 'components/Forms/Input'
import moment from 'moment'
import { Column } from 'nav-hoykontrast'
import React from 'react'
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
  const { t } = useTranslation()

  const onStartDatoChanged = (startDato: string) => {
    const date = toFinalDateFormat(startDato)
    setStartDato(date)
  }

  const onEndDatoChanged = (sluttDato: string) => {
    const date = toFinalDateFormat(sluttDato)
    setSluttDato(date)
  }

  return (
    <>
      <Column>
        <Input
          ariaLabel={labelStartDato || t('label:startdato')}
          feil={errorStartDato}
          id='startdato'
          key={namespace + '-startdato-' + valueStartDato}
          label={labels ? labelStartDato || t('label:startdato') + ' *' : ''}
          namespace={namespace}
          onChanged={onStartDatoChanged}
          placeholder={t('el:placeholder-date-default')}
          required
          value={toUIDateFormat(valueStartDato) ?? ''}
        />
      </Column>
      <Column>
        <Input
          ariaLabel={labelSluttDato || t('label:sluttdato')}
          feil={errorSluttDato}
          id='sluttdato'
          key={namespace + '-sluttdato-' + valueSluttDato}
          label={labels ? labelSluttDato || t('label:sluttdato') : ''}
          namespace={namespace}
          onChanged={onEndDatoChanged}
          placeholder={t('el:placeholder-date-default')}
          value={toUIDateFormat(valueSluttDato) ?? ''}
        />
      </Column>
    </>
  )
}

export default Period
