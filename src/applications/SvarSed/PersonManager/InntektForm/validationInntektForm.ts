import { validatePeriod } from 'components/Period/validation'
import { Loennsopplysning } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationLoennsopplysningProps {
  loennsopplysning: Loennsopplysning,
  loennsopplysninger: Array<Loennsopplysning>,
  index?: number
  namespace: string
}

export const validateLoennsopplysning = (
  v: Validation,
  t: TFunction,
  {
    loennsopplysning,
    loennsopplysninger,
    index,
    namespace
  }: ValidationLoennsopplysningProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  const periodeError: boolean = validatePeriod(v, t, {
    period: loennsopplysning?.periode,
    namespace: namespace + '-periode'
  })
  hasErrors = hasErrors || periodeError

  if (!_.isEmpty(loennsopplysning?.periode?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(loennsopplysninger, p => p.periode.startdato === loennsopplysning?.periode.startdato && p.periode.sluttdato === loennsopplysning.periode?.sluttdato) !== undefined
    } else {
      const otherPerioder: Array<Loennsopplysning> = _.filter(loennsopplysninger, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, p => p.periode.startdato === loennsopplysning?.periode?.startdato && p.periode.sluttdato === loennsopplysning.periode?.sluttdato) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-startdato'] = {
        feilmelding: t('message:validation-duplicateStartdato'),
        skjemaelementId: namespace + idx + '-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}

export const validateLoennsopplysninger = (
  validation: Validation,
  t: TFunction,
  loennsopplysninger: Array<Loennsopplysning>,
  namespace: string
): boolean => {
  let hasErrors: boolean = false
  loennsopplysninger?.forEach((loennsopplysning: Loennsopplysning, index: number) => {
    const _errors: boolean = validateLoennsopplysning(validation, t, {
      loennsopplysning: loennsopplysning,
      loennsopplysninger: loennsopplysninger,
      index,
      namespace
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
