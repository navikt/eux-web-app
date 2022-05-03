import { validatePeriode } from 'components/Forms/validation'
import { PensjonPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationArbeidsperiodeProps {
  periode: Periode,
  perioder: Array<Periode> | undefined,
  index?: number
  namespace: string
  personName?: string
}

export const validateAnsattPeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    perioder,
    index,
    namespace,
    personName
  }: ValidationArbeidsperiodeProps
): boolean => {
  let hasErrors: boolean = validatePeriode(v, t, {
    periode,
    namespace: namespace + '-periode',
    index,
    personName
  })
  const idx = getIdx(index)
  if (!_.isEmpty(periode?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(perioder, p => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato) !== undefined
    } else {
      const otherPerioder: Array<Periode> = _.filter(perioder, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, p => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato) !== undefined
    }
    if (duplicate) {
      v[namespace + '-periode' + idx + '-startdato'] = {
        feilmelding: t('validation:duplicateStartdato') + (personName ? t('validation:til-person', { person: personName }) : ''),
        skjemaelementId: namespace + '-periode' + idx + '-startdato'
      } as ErrorElement
      hasErrors = true
    }
  }

  return hasErrors
}

interface ValidateAnsattPerioderProps {
  perioder: Array<Periode>
  namespace: string
  personName?: string
}

export const validateAnsattPerioder = (
  v: Validation,
  t: TFunction,
  {
    perioder,
    namespace,
    personName
  }: ValidateAnsattPerioderProps
): boolean => {
  let hasErrors: boolean = false
  perioder?.forEach((periode: Periode | PensjonPeriode, index: number) => {
    const _error = validateAnsattPeriode(v, t, { periode: (periode as Periode), perioder, index, namespace, personName })
    hasErrors = hasErrors || _error
  })

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}
