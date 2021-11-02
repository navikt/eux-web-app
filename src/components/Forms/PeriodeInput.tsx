import classNames from 'classnames'
import Input from 'components/Forms/Input'
import { Periode, PeriodeInputType } from 'declarations/sed'
import _ from 'lodash'
import moment, { Moment } from 'moment'
import { Checkbox } from 'nav-frontend-skjema'
import { Column } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const WrapperDiv = styled.div`
  display: flex;
  flex-direction: row;
  height: 2.3rem;
  min-width: 5rem;
  align-items: center;
`

export interface PeriodeProps<T> {
  error: {
    startdato: string | null | undefined
    sluttdato: string | null | undefined
  }
  index?: number
  label?: {
    startdato?: string
    sluttdato?: string
  }
  periodeType?: PeriodeInputType
  requiredStartDato?: boolean
  requiredSluttDato?: boolean
  namespace: string
  setPeriode: (periode: T, id: string) => void
  showLabel?: boolean
  value: T | null | undefined
}

const parseDate = (date: string | undefined): Moment | undefined => {
  if (!date) return undefined
  if (date === '') return undefined
  let newDate: Moment
  if (date.match(/\d{2}.\d{2}.\d{4}/)) {
    newDate = moment(date, 'DD.MM.YYYY')
  } else if (date.match(/\d{4}-\d{2}-\d{2}/)) {
    newDate = moment(date, 'YYYY-MM-DD')
  } else {
    newDate = moment(date)
  }
  return newDate
}

export const toFinalDateFormat = (date: string | undefined): string => {
  const newDate = parseDate(date)
  if (!newDate) {return ''}
  return newDate.isValid() ? newDate!.format('YYYY-MM-DD') : ''
}

export const toUIDateFormat = (date: string | undefined): string => {
  const newDate = parseDate(date)
  if (!newDate) {return ''}
  return newDate.isValid() ? newDate.format('DD.MM.YYYY') : ''
}

const PeriodeInput = <T extends Periode>({
  error,
  label = {},
  namespace,
  periodeType = 'withcheckbox',
  requiredStartDato = true,
  requiredSluttDato = false,
  setPeriode,
  showLabel = true,
  value
}: PeriodeProps<T>) => {
  const { t } = useTranslation()

  const [_periode, _setPeriode] = useState<T | null | undefined>(value)

  const onStartDatoChanged = (startDato: string) => {
    const newPeriode: T = _.cloneDeep(_periode) ?? {} as T
    newPeriode.startdato = toFinalDateFormat(startDato)
    _setPeriode(newPeriode)
    setPeriode(newPeriode, 'startdato')
  }

  const onEndDatoChanged = (sluttDato: string) => {
    const newPeriode: T = _.cloneDeep(_periode) ?? {} as T
    newPeriode.sluttdato = toFinalDateFormat(sluttDato)
    if (_.isEmpty(newPeriode.sluttdato)) {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    } else {
      delete newPeriode.aapenPeriodeType
    }
    _setPeriode(newPeriode)
    setPeriode(newPeriode, 'sluttdato')
  }

  const onCheckboxChanged = (checked: boolean) => {
    const newPeriode: T = _.cloneDeep(_periode) ?? {} as T
    newPeriode.aapenPeriodeType = checked ? 'ukjent_sluttdato' : 'åpen_sluttdato'
    _setPeriode(newPeriode)
    setPeriode(newPeriode, 'aapenPeriodeType')
  }

  return (
    <>
      <Column>
        <Input
          ariaLabel={label?.startdato ?? t('label:startdato')}
          feil={error.startdato}
          id='startdato'
          key={namespace + '-startdato-' + _periode?.startdato}
          label={showLabel ? label?.startdato ?? t('label:startdato') + (requiredStartDato ? ' *' : '') : ''}
          namespace={namespace}
          onChanged={onStartDatoChanged}
          placeholder={t('el:placeholder-date-default')}
          required={requiredStartDato}
          value={toUIDateFormat(_periode?.startdato) ?? ''}
        />
      </Column>
      <Column>
        <Input
          ariaLabel={label?.sluttdato || t('label:sluttdato')}
          feil={error.sluttdato}
          id='sluttdato'
          key={namespace + '-sluttdato-' + _periode?.sluttdato}
          label={showLabel ? label?.sluttdato ?? t('label:sluttdato') + (requiredSluttDato ? ' *' : '') : ''}
          namespace={namespace}
          onChanged={onEndDatoChanged}
          placeholder={t('el:placeholder-date-default')}
          required={requiredSluttDato}
          value={toUIDateFormat(_periode?.sluttdato) ?? ''}
        />
      </Column>
      {(periodeType === 'withcheckbox' || requiredSluttDato === true) && (
        <WrapperDiv className={classNames('slideInFromLeft', { nolabel: showLabel })}>
          {_.isEmpty(_periode?.sluttdato) && (
            <Checkbox
              checked={_periode?.aapenPeriodeType === 'ukjent_sluttdato'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCheckboxChanged(e.target.checked)}
              label={t('label:ukjent')}
            />
          )}
        </WrapperDiv>
      )}
    </>
  )
}

export default PeriodeInput
