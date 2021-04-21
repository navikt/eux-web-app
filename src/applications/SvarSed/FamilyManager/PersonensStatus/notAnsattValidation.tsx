import { validatePeriod } from 'components/Period/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationNotAnsattProps {
  period: Periode
  otherPeriods: Array<Periode>
  index: number
  namespace: string
}

export const validateNotAnsatte = (
  v: Validation,
  t: TFunction,
  {
    period,
    otherPeriods,
    index,
    namespace
  }: ValidationNotAnsattProps
): void => {
  let idx = (index < 0 ? '' : '[' + index + ']')

  validatePeriod(v, t, {
    period,
    index,
    namespace
  })

  if (!v[namespace + '-startdato'] &&
    _.find(otherPeriods, p => p.startdato === period.startdato)) {
    v[namespace + '-startdato'] = {
      skjemaelementId: 'c-' + namespace + idx + '-startdato-date',
      feilmelding: t('message:validation-duplicateStartDate')
    } as FeiloppsummeringFeil
  }
}
