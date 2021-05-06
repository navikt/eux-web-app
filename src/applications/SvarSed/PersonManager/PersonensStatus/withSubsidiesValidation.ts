import { validatePeriod } from 'components/Period/validation'
import { PensjonPeriode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationWithSubsidiesProps {
  pensjonPeriod: PensjonPeriode
  otherPensjonPeriods: Array<PensjonPeriode>
  index?: number
  namespace: string
}

export const validateWithSubsidies = (
  v: Validation,
  t: TFunction,
  {
    pensjonPeriod,
    otherPensjonPeriods,
    index,
    namespace
  }: ValidationWithSubsidiesProps
): boolean => {
  const idx = getIdx(index)

  let hasErrors: boolean = validatePeriod(v, t, {
    period: pensjonPeriod.periode,
    index,
    namespace: namespace + idx + '-periode'
  })

  if (_.find(otherPensjonPeriods, p => p.periode.startdato === pensjonPeriod.periode.startdato) !== undefined) {
    v[namespace + idx + '-periode-startdato'] = {
      skjemaelementId: namespace + idx + '-periode-startdato',
      feilmelding: t('message:validation-duplicateStartDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!pensjonPeriod.pensjonstype) {
    v[namespace + '-pensjontype'] = {
      skjemaelementId: namespace + '-pensjontype',
      feilmelding: t('message:validation-noPensjonType')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}
