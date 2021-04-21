import { validatePeriod } from 'components/Period/validation'
import { PensjonPeriode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationWithSubsidiesProps {
  pensjonPeriod: PensjonPeriode
  otherPensjonPeriods: Array<PensjonPeriode>
  index: number
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
): void => {
  const period = pensjonPeriod.periode
  validatePeriod(v, t, {
    period,
    index,
    namespace
  })
  const idx = (index < 0 ? '' : '[' + index + ']')

  if (!v[namespace + '-startdato'] &&
    _.find(otherPensjonPeriods, p => p.periode.startdato === period.startdato)) {
    v[namespace + '-startdato'] = {
      skjemaelementId: 'c-' + namespace + idx + '-startdato-date',
      feilmelding: t('message:validation-duplicateStartDate')
    } as FeiloppsummeringFeil
  }

  if (!pensjonPeriod.pensjonstype) {
    v[namespace + '-pensjontype'] = {
      skjemaelementId: 'c-' + namespace + '-pensjontype-text',
      feilmelding: t('message:validation-noPensjonType')
    } as FeiloppsummeringFeil
  }
}
