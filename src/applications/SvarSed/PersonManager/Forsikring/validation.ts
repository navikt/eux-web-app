import { validatePeriode } from 'components/Forms/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationForsikringProps {
  periode: Periode
  type: string | undefined
  namespace: string
  personName: string
}

export const validateForsikring = (
  v: Validation,
  t: TFunction,
  {
    periode,
    type,
    namespace
  }: ValidationForsikringProps
): boolean => {
  let hasErrors = validatePeriode(v, t, {
    periode,
    namespace
  })

  if (_.isEmpty(type)) {
    v[namespace + '-type'] = {
      skjemaelementId: namespace + '-type',
      feilmelding: t('message:validation-noType')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}
