import { Checkbox } from '@navikt/ds-react'
import classNames from 'classnames'
import { Periode, PeriodeInputType } from 'declarations/sed'
import _ from 'lodash'
import { Column } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import DateField, {toDateFormat} from "components/DateField/DateField";

const WrapperDiv = styled.div`
  display: flex;
  flex-direction: row;
  height: 3rem;
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
  hideLabel?: boolean
  value: T | null | undefined
  uiFormat ?: string
  finalFormat ?: string
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
  hideLabel = true,
  value,
  finalFormat = 'YYYY-MM-DD',
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
        <DateField
          key={namespace + '-startdato-' + value?.startdato}
          id='startdato'
          error={error.startdato}
          label={label?.startdato ?? t('label:startdato') + ' (' + t('el:placeholder-date-default') + ')'}
          onChanged={onStartDatoChanged}
          dateValue={value?.startdato}
          hideLabel={hideLabel}
          required={requiredStartDato}
        />
      </Column>
      <Column>
        <DateField
          key={namespace + '-sluttdato-' + value?.sluttdato}
          id='sluttdato'
          error={error.sluttdato}
          label={label?.sluttdato ?? t('label:sluttdato') + ' (' + t('el:placeholder-date-default') + ')'}
          onChanged={onEndDatoChanged}
          dateValue={value?.sluttdato}
          hideLabel={hideLabel}
          required={requiredSluttDato}
        />
      </Column>
      {breakInTwo && <div />}
      {periodeType === 'withcheckbox' && (
        <WrapperDiv className={classNames({ nolabel: !hideLabel })}>
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
