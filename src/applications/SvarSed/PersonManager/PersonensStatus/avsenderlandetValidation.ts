import { validatePeriod } from 'components/Period/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationAvsenderlandetProps {
  period: Periode
  otherPeriods: Array<Periode>
  index?: number
  namespace: string
}

export const validateAvsenderlandet = (
  v: Validation,
  t: TFunction,
  {
    period,
    otherPeriods,
    index,
    namespace
  }: ValidationAvsenderlandetProps
): boolean => {
  const idx = getIdx(index)

  let hasErrors: boolean = validatePeriod(v, t, {
    period,
    index,
    namespace
  })

  if (_.find(otherPeriods, p => p.startdato === period.startdato) !== undefined) {
    v[namespace + idx + '-startdato'] = {
      skjemaelementId: namespace + idx + '-startdato',
      feilmelding: t('message:validation-duplicateStartDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}
