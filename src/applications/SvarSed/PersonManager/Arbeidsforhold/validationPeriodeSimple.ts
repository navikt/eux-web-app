import { validatePeriode } from 'components/Forms/validation'
import { PeriodeForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPeriodeSimpleProps {
  periode: PeriodeForsikring,
  perioder: Array<PeriodeForsikring>,
  index?: number
  namespace: string
}

export const validatePeriodeSimple = (
  v: Validation,
  t: TFunction,
  {
    periode,
    perioder,
    index,
    namespace
  }: ValidationPeriodeSimpleProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  const periodeError: boolean = validatePeriode(v, t, {
    periode: periode?.periode,
    namespace
  })
  hasErrors = hasErrors || periodeError

  if (!_.isEmpty(periode?.periode?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(perioder, p => p.periode.startdato === periode?.periode.startdato && p.periode.sluttdato === periode?.periode.sluttdato) !== undefined
    } else {
      const otherPerioder: Array<PeriodeForsikring> = _.filter(perioder, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, p => p.periode.startdato === periode?.periode?.startdato && p.periode.sluttdato === periode?.periode.sluttdato) !== undefined
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

interface ValidatePerioderSimpleProps {
  perioder: Array<PeriodeForsikring> | undefined
  namespace: string
}

export const validatePerioderSimple = (
  validation: Validation,
  t: TFunction,
  {
    perioder,
    namespace
  }: ValidatePerioderSimpleProps
): boolean => {
  let hasErrors: boolean = false
  perioder?.forEach((periode: PeriodeForsikring, index: number) => {
    const _errors: boolean = validatePeriodeSimple(validation, t, {
      periode: periode,
      perioder: perioder,
      index,
      namespace
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
