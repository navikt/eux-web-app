import { validatePeriode } from 'components/Forms/validation'
import { Loennsopplysning } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { getIdx } from 'utils/namespace'

export interface ValidationLoennsopplysningProps {
  loennsopplysning: Loennsopplysning,
  loennsopplysninger: Array<Loennsopplysning>,
  index?: number
  namespace: string
}

export const validateLoennsopplysning = (
  v: Validation,
  {
    loennsopplysning,
    loennsopplysninger,
    index,
    namespace
  }: ValidationLoennsopplysningProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  const periodeError: boolean = validatePeriode(v, {
    periode: loennsopplysning?.periode,
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
        feilmelding: t('validation:duplicateStartdato'),
        skjemaelementId: namespace + idx + '-startdato'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (_.isEmpty(loennsopplysning?.periodetype)) {
    v[namespace + idx + '-periodetype'] = {
      feilmelding: t('validation:noPeriodeType'),
      skjemaelementId: namespace + idx + '-periodetype'
    } as ErrorElement
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}

export interface ValidationLoennsopplysningerProps {
  loennsopplysninger: Array<Loennsopplysning> | undefined
  namespace: string
}

export const validateLoennsopplysninger = (
  validation: Validation,
  {
    loennsopplysninger,
    namespace
  }: ValidationLoennsopplysningerProps
): boolean => {
  let hasErrors: boolean = false
  loennsopplysninger?.forEach((loennsopplysning: Loennsopplysning, index: number) => {
    const _errors: boolean = validateLoennsopplysning(validation, {
      loennsopplysning,
      loennsopplysninger,
      index,
      namespace
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}