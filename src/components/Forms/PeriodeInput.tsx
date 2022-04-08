import { Checkbox } from '@navikt/ds-react'
import classNames from 'classnames'
import Input from 'components/Forms/Input'
import { Periode, PeriodeInputType } from 'declarations/sed'
import _ from 'lodash'
import moment, { Moment } from 'moment'
import { Column } from '@navikt/hoykontrast'
import React from 'react'
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
  breakInTwo ?: boolean
  error: {
    startdato: string | null | undefined
    sluttdato: string | null | undefined
    aapenPeriodeType?: string | null | undefined
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
  uiFormat ?: string
  finalFormat ?: string
}

const parseDate = (date: string | undefined): Moment | undefined => {
  if (!date) return undefined
  if (date === '') return undefined
  let newDate: Moment
  if (date.match(/\d{2}.\d{2}.\d{4}/)) {
    newDate = moment(date, 'DD.MM.YYYY')
  } else if (date.match(/\d{4}-\d{2}-\d{2}/)) {
    newDate = moment(date, 'YYYY-MM-DD')
  } else if (date.match(/\d{6}/)) {
    newDate = moment(date, 'DDMMYY')
  } else {
    newDate = moment(date)
  }
  return newDate
}

export const toDateFormat = (date: string | undefined, format: string): string => {
  const newDate = parseDate(date)
  if (!newDate) { return '' }
  return newDate.isValid() ? newDate!.format(format) : ''
}

const PeriodeInput = <T extends Periode>({
  error,
  breakInTwo = false,
  label = {},
  namespace,
  periodeType = 'withcheckbox',
  requiredStartDato = true,
  requiredSluttDato = false,
  setPeriode,
  showLabel = true,
  value,
  finalFormat = 'YYYY-MM-DD',
  uiFormat = 'DD.MM.YYYY'
}: PeriodeProps<T>) => {
  const { t } = useTranslation()

  const onStartDatoChanged = (startDato: string) => {
    const newPeriode: T = _.cloneDeep(value) ?? {} as T
    newPeriode.startdato = toDateFormat(startDato, finalFormat!)
    if (periodeType === 'withcheckbox' && _.isEmpty(newPeriode.sluttdato) && _.isEmpty(newPeriode.aapenPeriodeType)) {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }
    setPeriode(newPeriode, 'startdato')
  }

  const onEndDatoChanged = (sluttDato: string) => {
    const newPeriode: T = _.cloneDeep(value) ?? {} as T
    newPeriode.sluttdato = toDateFormat(sluttDato, finalFormat!)
    if (periodeType === 'withcheckbox' && _.isEmpty(newPeriode.sluttdato)) {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    } else {
      delete newPeriode.aapenPeriodeType
    }
    setPeriode(newPeriode, 'sluttdato')
  }

  const onCheckboxChanged = (checked: boolean) => {
    const newPeriode: T = _.cloneDeep(value) ?? {} as T
    newPeriode.aapenPeriodeType = checked ? 'ukjent_sluttdato' : 'åpen_sluttdato'
    setPeriode(newPeriode, 'aapenPeriodeType')
  }

  return (
    <>
      <Column>
        <Input
          ariaLabel={label?.startdato ?? t('label:startdato')}
          error={error.startdato}
          id='startdato'
          key={namespace + '-startdato-' + value?.startdato}
          label={showLabel
            ? (label?.startdato ?? t('label:startdato') + (requiredStartDato ? ' *' : '')) +
            ' (' + t('el:placeholder-date-default') + ')'
            : ''}
          namespace={namespace}
          onChanged={onStartDatoChanged}
          required={requiredStartDato}
          value={toDateFormat(value?.startdato, uiFormat!) ?? ''}
        />
      </Column>
      <Column>
        <Input
          ariaLabel={label?.sluttdato || t('label:sluttdato')}
          error={error.sluttdato}
          id='sluttdato'
          key={namespace + '-sluttdato-' + value?.sluttdato}
          label={showLabel
            ? (label?.sluttdato ?? t('label:sluttdato') + (requiredSluttDato ? ' *' : '')) +
              ' (' + t('el:placeholder-date-default') + ')'
            : ''}
          namespace={namespace}
          onChanged={onEndDatoChanged}
          required={requiredSluttDato}
          value={toDateFormat(value?.sluttdato, uiFormat!) ?? ''}
        />
      </Column>
      {breakInTwo && <div />}
      {(periodeType === 'withcheckbox' || requiredSluttDato === true) && (
        <WrapperDiv className={classNames('slideInFromLeft', { nolabel: showLabel })}>
          {_.isEmpty(value?.sluttdato) && (
            <Checkbox
              error={!!error.aapenPeriodeType}
              id='aapenPeriodeType'
              checked={value?.aapenPeriodeType === 'ukjent_sluttdato'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCheckboxChanged(e.target.checked)}
            > {t('label:ukjent')}
            </Checkbox>
          )}
        </WrapperDiv>
      )}
    </>
  )
}

export default PeriodeInput
