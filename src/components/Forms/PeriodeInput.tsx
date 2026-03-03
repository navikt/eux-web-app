import {Checkbox, HGrid, HStack} from '@navikt/ds-react'
import classNames from 'classnames'
import { Periode, PeriodeInputType } from 'declarations/sed'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import DateField, {isDateValidFormat, toDateFormat} from "components/DateField/DateField";


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
  asGrid?: boolean
}

const PeriodeInput = <T extends Periode>({
  error,
  label = {},
  namespace,
  periodeType = 'withcheckbox',
  requiredStartDato = true,
  requiredSluttDato = false,
  setPeriode,
  hideLabel = true,
  value,
  finalFormat = 'YYYY-MM-DD',
  asGrid = false
}: PeriodeProps<T>) => {
  const { t } = useTranslation()

  const onStartDatoChanged = (startDato: string) => {
    const newPeriode: T = _.cloneDeep(value) ?? {} as T
    newPeriode.startdato = isDateValidFormat(startDato) ? toDateFormat(startDato, finalFormat!) : startDato
    if (periodeType === 'withcheckbox' && _.isEmpty(newPeriode.sluttdato) && _.isEmpty(newPeriode.aapenPeriodeType)) {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }
    setPeriode(newPeriode, 'startdato')
  }

  const onEndDatoChanged = (sluttDato: string) => {
    const newPeriode: T = _.cloneDeep(value) ?? {} as T
    newPeriode.sluttdato = isDateValidFormat(sluttDato) ? toDateFormat(sluttDato, finalFormat!) : sluttDato
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

  const dateFields = () => {
    return (
      <>
        <DateField
          key={namespace + '-startdato-' + value?.startdato}
          id='startdato'
          namespace={namespace}
          error={error.startdato}
          label={label?.startdato ?? t('label:startdato')}
          onChanged={onStartDatoChanged}
          dateValue={value?.startdato}
          hideLabel={hideLabel}
          required={requiredStartDato}
        />
        <DateField
          key={namespace + '-sluttdato-' + value?.sluttdato}
          namespace={namespace}
          id='sluttdato'
          error={error.sluttdato}
          label={label?.sluttdato ?? t('label:sluttdato')}
          onChanged={onEndDatoChanged}
          dateValue={value?.sluttdato}
          hideLabel={hideLabel}
          required={requiredSluttDato}
        />
        {periodeType === 'withcheckbox' && (
          <HStack align="center" minHeight="3rem" minWidth="5rem" className={classNames({ nolabel: !hideLabel })}>
            {_.isEmpty(value?.sluttdato) && (
              <Checkbox
                error={!!error.aapenPeriodeType}
                id='aapenPeriodeType'
                checked={value?.aapenPeriodeType === 'ukjent_sluttdato'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCheckboxChanged(e.target.checked)}
              > {t('label:ukjent')}
              </Checkbox>
            )}
          </HStack>
        )}
      </>
    )
  }

  return (asGrid ? <HGrid columns={periodeType === "withcheckbox" ? 3 : 2} gap="space-16" align={"start"}>
    {dateFields()}
  </HGrid> : <HStack gap="space-16" wrap={false} align={"start"}>
    {dateFields()}
  </HStack>);
}

export default PeriodeInput
