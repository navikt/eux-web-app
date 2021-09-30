import classNames from 'classnames'
import Input from 'components/Forms/Input'
import { Periode, PeriodeType } from 'declarations/sed'
import _ from 'lodash'
import moment from 'moment'
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

export interface PeriodProps {
  error: {
    startdato: string | null | undefined
    sluttdato: string | null | undefined
  }
  index?: number
  label?: {
    startdato?: string
    sluttdato?: string
  }
  periodeType?: PeriodeType
  namespace: string
  setPeriode: (periode: Periode) => void
  showLabel?: boolean
  value: Periode | null | undefined
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

const PeriodeInput = ({
  error,
  label = {},
  namespace,
  periodeType = 'withcheckbox',
  setPeriode,
  showLabel = true,
  value
}: PeriodProps) => {
  const { t } = useTranslation()

  const [_periode, _setPeriode] = useState<Periode | null | undefined>(value)

  const onStartDatoChanged = (startDato: string) => {
    const newPeriode: Periode = _.cloneDeep(_periode) ?? {} as Periode
    newPeriode.startdato = toFinalDateFormat(startDato)
    _setPeriode(newPeriode)
    setPeriode(newPeriode)
  }

  const onEndDatoChanged = (sluttDato: string) => {
    const newPeriode: Periode = _.cloneDeep(_periode) ?? {} as Periode
    newPeriode.sluttdato = toFinalDateFormat(sluttDato)
    if (_.isEmpty(newPeriode.sluttdato)) {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    } else {
      delete newPeriode.aapenPeriodeType
    }
    _setPeriode(newPeriode)
    setPeriode(newPeriode)
  }

  const onCheckboxChanged = (checked: boolean) => {
    const newPeriode: Periode = _.cloneDeep(_periode) ?? {} as Periode
    newPeriode.aapenPeriodeType = checked ? 'ukjent_sluttdato' : 'åpen_sluttdato'
    _setPeriode(newPeriode)
    setPeriode(newPeriode)
  }

  return (
    <>
      <Column>
        <Input
          ariaLabel={label?.startdato ?? t('label:startdato')}
          feil={error.startdato}
          id='startdato'
          key={namespace + '-startdato-' + _periode?.startdato}
          label={showLabel ? label?.startdato ?? t('label:startdato') + ' *' : ''}
          namespace={namespace}
          onChanged={onStartDatoChanged}
          placeholder={t('el:placeholder-date-default')}
          required
          value={toUIDateFormat(_periode?.startdato) ?? ''}
        />
      </Column>
      <Column>
        <Input
          ariaLabel={label?.sluttdato || t('label:sluttdato')}
          feil={error.sluttdato}
          id='sluttdato'
          key={namespace + '-sluttdato-' + _periode?.sluttdato}
          label={showLabel ? label?.startdato ?? t('label:sluttdato') : ''}
          namespace={namespace}
          onChanged={onEndDatoChanged}
          placeholder={t('el:placeholder-date-default')}
          value={toUIDateFormat(_periode?.sluttdato) ?? ''}
        />
      </Column>
      <WrapperDiv className={classNames('slideInFromLeft', { nolabel: showLabel })}>
        {periodeType === 'withcheckbox' && _.isEmpty(_periode?.sluttdato) && (
          <Checkbox
            checked={_periode?.aapenPeriodeType === 'ukjent_sluttdato'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCheckboxChanged(e.target.checked)}
            label={t('label:ukjent')}
          />
        )}
      </WrapperDiv>
    </>
  )
}

export default PeriodeInput
